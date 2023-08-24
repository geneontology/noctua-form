import { environment } from './../../environments/environment';
import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, EMPTY, forkJoin, from, Observable } from 'rxjs';
import { map, finalize, switchMap, mergeMap } from 'rxjs/operators';

import {
    Cam,
    Entity,

    CamQueryMatch,
    NoctuaUserService,
    BbopGraphService,
    CamStats,
    CamService,
    CamLoadingIndicator,
    _compareEntityWeight,
    ReloadType,
} from '@geneontology/noctua-form-base';
import { SearchCriteria } from './../models/search-criteria';
import { saveAs } from 'file-saver';
import { each, find, remove } from 'lodash';
import { CurieService } from '@noctua.curie/services/curie.service';
import { CamPage } from './../models/cam-page';
import { SearchHistory } from './../models/search-history';
import { ArtBasket } from '@noctua.search/models/art-basket';
import { NoctuaSearchMenuService } from './search-menu.service';
import { NoctuaSearchService } from './noctua-search.service';
import { LeftPanel, MiddlePanel } from './../models/menu-panels';
import { NoctuaConfirmDialogService } from '@noctua/components/confirm-dialog/confirm-dialog.service';



@Injectable({
    providedIn: 'root'
})
export class NoctuaReviewSearchService {
    artBasket = new ArtBasket();
    searchHistory: SearchHistory[] = [];
    onSearchCriteriaChanged: BehaviorSubject<any>;
    onSearchHistoryChanged: BehaviorSubject<any>;
    onCamTermSearch: BehaviorSubject<any>;
    onCamReplaceTermSearch: BehaviorSubject<any>;
    curieUtil: any;
    camPage: CamPage;
    searchCriteria: SearchCriteria;
    searchApi = environment.searchApi;
    loading = false;
    // onCamsChanged: BehaviorSubject<any>;
    onArtBasketChanged: BehaviorSubject<any>;
    onResetReview: BehaviorSubject<boolean>;
    onClearForm: BehaviorSubject<boolean>;
    onReplaceChanged: BehaviorSubject<boolean>;
    onCamsPageChanged: BehaviorSubject<any>;
    onCamChanged: BehaviorSubject<any>;
    matchedEntities: Entity[] = [];
    matchedCountCursor = 0;
    matchedCount = 0;
    currentMatchedEnity: Entity;

    filterType = {
        gps: 'gps',
        terms: 'terms',
        pmids: 'pmids',
    };

    constructor(
        private zone: NgZone,
        private noctuaUserService: NoctuaUserService,
        private _bbopGraphService: BbopGraphService,
        private _noctuaSearchService: NoctuaSearchService,
        private noctuaSearchMenuService: NoctuaSearchMenuService,
        private confirmDialogService: NoctuaConfirmDialogService,
        private httpClient: HttpClient,
        private camService: CamService,

        private curieService: CurieService) {
        const self = this;

        this.onArtBasketChanged = new BehaviorSubject(null);
        this.onResetReview = new BehaviorSubject(false);
        this.onClearForm = new BehaviorSubject(false);
        this.onReplaceChanged = new BehaviorSubject(false);
        this.onCamsPageChanged = new BehaviorSubject(null);
        this.onCamChanged = new BehaviorSubject([]);
        this.onCamTermSearch = new BehaviorSubject(null);
        this.onCamReplaceTermSearch = new BehaviorSubject(null);
        this.onSearchHistoryChanged = new BehaviorSubject(null);
        this.searchCriteria = new SearchCriteria();
        this.onSearchCriteriaChanged = new BehaviorSubject(null);
        this.curieUtil = this.curieService.getCurieUtil();

        this.onSearchCriteriaChanged.subscribe((searchCriteria: SearchCriteria) => {
            if (!searchCriteria) {
                return;
            }

            self.camService.resetMatch();

            if (searchCriteria.ids.length > 0) {
                self.getCams(searchCriteria).subscribe(() => {
                    // self.cams = response;
                    self.matchedCountCursor = 0;
                    self.calculateMatched();
                    self.camService.applyMatchWeights(self.camService.cams);
                    self.sortMatched();
                    self.goto(0);
                });

                //self.noctuaSearchMenuService.scrollToTop();
            }
        });

        this.camService.onCamsChanged
            .subscribe((cams: Cam[]) => {
                if (!cams) {
                    return;
                }
                const ids = cams.map((cam: Cam) => {
                    return cam.id;
                });

                this.searchCriteria.ids = ids;
            });

        self.loadCamRebuild()
    }

    setup() {
        if (!this.noctuaUserService.user) {
            this.clearBasket();
            return;
        }

        const artBasket = localStorage.getItem('artBasket');

        if (artBasket) {
            this.artBasket = new ArtBasket(JSON.parse(artBasket));
            this.camService.cams = [];
            this.addCamsToReview(this.artBasket.cams, this.camService.cams);
            this.onArtBasketChanged.next(this.artBasket);
        }
    }

    loadCamRebuild() {
        const self = this;
        self._bbopGraphService.onCamRebuildChange.subscribe((cam: Cam) => {
            if (!cam) {
                return;
            }

            self.updateStoredCams([cam], self.camService.cams);
        })
    }

    addCamsToReview(metaCams: any[], cams: Cam[]) {
        const self = this;

        if (!metaCams || metaCams.length === 0) return;

        const ids = metaCams.reduce((camIds, metaCam) => {
            if (!find(cams, { id: metaCam.id })) {
                camIds.push(metaCam.id);
                return camIds;
            } else return camIds;
        }, []);

        self.updateSearch(true, [...ids, ...cams.map(cam => cam.id)]);

        if (ids.length === 0) return;

        self.searchCamsByIds(ids).pipe(
            switchMap((inCams: any[]) => {
                const promises = [];

                each(inCams, (inCam: Cam) => {
                    const metaCam = find(metaCams, { id: inCam.id });

                    inCam.expanded = true;
                    inCam.dateReviewAdded = metaCam ? metaCam.dateAdded : Date.now();
                    inCam.title = metaCam?.title;
                    cams.push(inCam);
                    self.camService.loadCamMeta(inCam);
                    inCam.loading = new CamLoadingIndicator(true, 'Loading Model Activities ...');
                    promises.push(inCam);
                })
                return from(promises);
            }),
            mergeMap((cam: Cam) => {
                return self.camService.getStoredModel(cam);
            }),
            finalize(() => {
                self.camService.sortCams();
                self.camService.updateDisplayNumber(cams);
                self.camService.onCamsChanged.next(cams);
                //self.camService.resetLoading(cams);
            })).subscribe({
                next: (response) => {
                    if (!response || !response.storedModel || !response.activeModel) return;

                    const cam = find(cams, { id: response.activeModel.id });

                    if (!cam) return;

                    self._bbopGraphService.rebuildFromStoredApi(cam, response.activeModel);
                    self.camService.populateStoredModel(cam, response.storedModel)
                    cam.loading.status = false;
                    self.camService.sortCams();
                    self.camService.updateDisplayNumber(cams);
                    self.camService.onCamsChanged.next(cams);
                    self.updateSearch();
                },
            })
    }

    removeCamFromReview(cam: Cam) {
        remove(this.camService.cams, { id: cam.id });
        this.updateSearch();
        this.artBasket.removeCamFromBasket(cam.id);
        localStorage.setItem('artBasket', JSON.stringify(this.artBasket));
        this.camService.updateDisplayNumber(this.camService.cams);
        this.camService.onCamsChanged.next(this.camService.cams);
        this.onArtBasketChanged.next(this.artBasket);
    }

    reloadCams(cams: Cam[], reviewCams: Cam[], reloadType: ReloadType, reset = false) {
        const self = this;

        if (!cams || cams.length === 0) return;

        const ids = cams.map(cam => cam.id);

        if (ids.length === 0) return;

        from(cams).pipe(
            mergeMap((cam: Cam) => {

                if (reloadType === ReloadType.RESET) {
                    cam.loading = new CamLoadingIndicator(true, 'Resetting Model ...');
                    return self.camService.resetCams([cam]);
                } else if (reloadType === ReloadType.STORE) {
                    cam.loading = new CamLoadingIndicator(true, 'Saving Model ...');
                    return self.camService.storeCams([cam]);
                } else {
                    return EMPTY;
                }
            }),
            finalize(() => {
                self.camService.updateDisplayNumber(reviewCams);
                self.camService.onCamsChanged.next(reviewCams);
                self.camService.resetLoading(cams);
                self._noctuaSearchService.updateSearch(false, false);
                self.onReplaceChanged.next(true);

                self.updateSearch();

                self.zone.run(() => {
                    self.camService.resetLoading(reviewCams);
                    self.confirmDialogService.openInfoToast('Changes successfully saved.', 'OK');
                    self.camService.reviewChangesCams();

                    if (reset) {
                        self.confirmAfterSave();
                    }
                });

            })).subscribe({
                next: (response) => {
                    if (!response || !response.data()) return;

                    const cam = find(reviewCams, { id: response.data().id });

                    if (!cam) return;

                    //self._bbopGraphService.rebuild(cam, response);
                    self.camService.populateStoredModel(cam, response.data())
                    cam.loading.status = false;
                    self.camService.updateDisplayNumber(reviewCams);
                    self.camService.onCamsChanged.next(reviewCams);
                    self.updateSearch();
                }
            })
    }

    updateStoredCams(cams: Cam[], reviewCams: Cam[]) {
        const self = this;

        if (!cams || cams.length === 0) return;

        const ids = cams.map(cam => {
            return cam.id
        });

        if (ids.length === 0) return;

        self.searchCamsByIds(ids).pipe(
            switchMap((inCams: any[]) => {
                const promises = [];

                each(inCams, (inCam: Cam) => {
                    inCam.expanded = true;
                    self.camService.loadCamMeta(inCam);
                    inCam.loading.status = true;
                    promises.push(inCam);
                })
                return from(promises);
            }),
            mergeMap((cam: Cam) => {
                const reviewCam = find(reviewCams, { id: cam.id });
                reviewCam.loading = new CamLoadingIndicator(true, 'Reloading Model ...');
                return self.camService.getStoredModel(cam);
            }),
            finalize(() => {

            })).subscribe({
                next: (response) => {
                    if (!response || !response.storedModel || !response.activeModel) return;

                    const cam = find(reviewCams, { id: response.activeModel.id });

                    if (!cam) return;
                    cam.rebuildRule.reset();
                    self._bbopGraphService.rebuildFromStoredApi(cam, response.activeModel);
                    self.camService.populateStoredModel(cam, response.storedModel)
                    cam.loading.status = false;
                    self.camService.sortCams();
                    self.camService.updateDisplayNumber(reviewCams);
                    self.camService.onCamsChanged.next(reviewCams);
                    self.updateSearch();

                }
            })
    }

    confirmAfterSave() {
        const self = this;

        const success = (reset) => {
            if (reset) {
                self.noctuaSearchMenuService.selectMiddlePanel(MiddlePanel.cams);
                self.noctuaSearchMenuService.selectLeftPanel(LeftPanel.filter);
                self.clear();
                self.camService.clearCams();
                self.clearBasket();
                self.onResetReview.next(true);
                self.noctuaSearchMenuService.scrollToTop();
            }
        }

        const options = {
            cancelLabel: 'No',
            confirmLabel: 'Yes'
        };

        this.confirmDialogService.openConfirmDialog('Changes successfully saved.',
            'Do you want to clear all your selected models from ART',
            success, options);
    }



    searchCamsByIds(ids: string[]) {
        const self = this;

        const searchCriteria = new SearchCriteria();
        searchCriteria.ids = ids;
        self.camService.resetMatch();

        return self._noctuaSearchService.getCams(searchCriteria);
    }

    search(searchCriteria) {
        this.searchCriteria = new SearchCriteria();

        searchCriteria.pmid ? this.searchCriteria.pmids.push(searchCriteria.pmid) : null;
        searchCriteria.term ? this.searchCriteria.terms.push(searchCriteria.term) : null;
        searchCriteria.id ? this.searchCriteria.ids.push(searchCriteria.id) : null;
        searchCriteria.gp ? this.searchCriteria.gps.push(searchCriteria.gp) : null;

        this.updateSearch();

    }

    findNext() {
        if (this.matchedCount === 0) {
            return;
        }

        // so it circulates
        this.matchedCountCursor = (this.matchedCountCursor + 1) % this.matchedCount;
        this.currentMatchedEnity = this.matchedEntities[this.matchedCountCursor];
        this.camService.expandMatch(this.currentMatchedEnity.uuid);
        this.camService.currentMatch = this.currentMatchedEnity;

        if (!this.currentMatchedEnity.activityDisplayId && this.matchedCountCursor < this.matchedCount) {
            this.findNext();
        } else {
            this.noctuaSearchMenuService.scrollTo('#' + this.currentMatchedEnity.activityDisplayId);
        }

        return this.currentMatchedEnity;
    }

    findPrevious() {
        if (this.matchedCount === 0) {
            return;
        }
        this.matchedCountCursor = this.matchedCountCursor - 1;

        if (this.matchedCountCursor < 0) {
            this.matchedCountCursor = this.matchedCount - 1;
        }

        this.currentMatchedEnity = this.matchedEntities[this.matchedCountCursor];
        this.camService.expandMatch(this.currentMatchedEnity.uuid);
        this.camService.currentMatch = this.currentMatchedEnity;
        this.noctuaSearchMenuService.scrollTo('#' + this.currentMatchedEnity.activityDisplayId);

        return this.currentMatchedEnity;
    }

    goto(step: number | 'first' | 'last') {
        if (this.matchedCount === 0) {
            return;
        }

        if (step === 'first') {
            step = 0;
        }

        if (step === 'last') {
            step = this.matchedEntities.length - 1;
        }

        this.matchedCountCursor = step;
        this.currentMatchedEnity = this.matchedEntities[this.matchedCountCursor];
        this.camService.expandMatch(this.currentMatchedEnity.uuid);
        this.camService.currentMatch = this.currentMatchedEnity;
        this.noctuaSearchMenuService.scrollTo('#' + this.currentMatchedEnity.activityDisplayId);

        return this.currentMatchedEnity;
    }

    clear() {
        this.matchedEntities = [];
        this.matchedCountCursor = 0;
        this.matchedCount = 0;
        this.currentMatchedEnity = undefined;
        this.camService.currentMatch = new Entity(null, null);
        this.searchCriteria = new SearchCriteria();
    }

    getPage(pageNumber: number, pageSize: number) {
        this.searchCriteria.camPage.pageNumber = pageNumber;
        this.searchCriteria.camPage.size = pageSize;
        this.updateSearch();
    }

    updateSearch(save: boolean = true, inIds?: string[]) {

        if (inIds && inIds.length > 0) {
            this.searchCriteria.ids = inIds
        } else {
            const ids = this.camService.cams.map((cam: Cam) => {
                return cam.id;
            });
            this.searchCriteria.ids = ids;
        }

        this.searchCriteria.updateFiltersCount();
        this.onSearchCriteriaChanged.next(this.searchCriteria);

        if (save) {
            this.saveHistory();
        }
    }

    filter(filterType, filter) {
        this.searchCriteria[filterType].push(filter);
        this.updateSearch();
    }

    removeFilterType(filterType: string) {
        this.searchCriteria[filterType] = [];
        this.updateSearch();
    }

    removeFilter(filterType) {
        this.searchCriteria[filterType] = null;
    }

    clearSearchCriteria() {
        this.searchCriteria = new SearchCriteria();
        this.updateSearch();
    }

    saveHistory() {
        const searchHistoryItem = new SearchHistory(this.searchCriteria);
        this.searchHistory.unshift(searchHistoryItem);
        this.onSearchHistoryChanged.next(this.searchHistory);
    }

    clearHistory() {
        this.searchHistory = [];
        this.onSearchHistoryChanged.next(this.searchHistory);
    }

    addToArtBasket(id: string, title: string) {
        this.artBasket.addCamToBasket(id, title);

        localStorage.setItem('artBasket', JSON.stringify(this.artBasket));
        this.onArtBasketChanged.next(this.artBasket);
    }

    clearBasket() {
        this.artBasket.clearBasket();
        localStorage.setItem('artBasket', JSON.stringify(this.artBasket));
        this.onArtBasketChanged.next(this.artBasket);
        this.noctuaSearchMenuService.scrollToTop();
    }

    downloadSearchConfig() {
        const blob = new Blob([JSON.stringify(this.searchCriteria, undefined, 2)], { type: 'application/json' });
        saveAs(blob, 'search-filter.json');
    }

    uploadSearchConfig(searchCriteria) {
        this.searchCriteria = new SearchCriteria();

        if (searchCriteria.ids) {
            this.searchCriteria.ids = searchCriteria.ids;
        }
        if (searchCriteria.pmids) {
            this.searchCriteria.pmids = searchCriteria.pmids;
        }
        if (searchCriteria.terms) {
            this.searchCriteria.terms = searchCriteria.terms;
        }
        if (searchCriteria.gps) {
            this.searchCriteria.gps = searchCriteria.gps;
        }

        this.updateSearch();
    }

    getCams(searchCriteria: SearchCriteria): Observable<any> {
        const self = this;

        searchCriteria.expand = false;
        const query = searchCriteria.build(false);
        const url = `${this.searchApi}/models?${query}`;

        self.loading = true;

        return this.httpClient
            .get(url)
            .pipe(
                map(res => this.addCam(res)),
                finalize(() => {
                    self.loading = false;
                })
            );
    }

    addCam(res) {
        const self = this;
        const result: Array<Cam> = [];

        each(self.camService.cams, (cam: Cam) => {
            return cam.clearHighlight();
        });

        res.models.forEach((response) => {

            const modelId = response.id;
            const cam: Cam = find(self.camService.cams, (inCam: Cam) => {
                return inCam.id === modelId;
            });

            if (cam) {
                cam.queryMatch = new CamQueryMatch();
                each(response.query_match, (queryMatch, key) => {
                    cam.queryMatch.terms.push(
                        ...queryMatch.map(v1 => {
                            return new Entity(
                                self.curieUtil.getCurie(key),
                                '',
                                null,
                                self.curieUtil.getCurie(v1),
                                cam.id
                            );
                        }));
                });

                cam.applyFilter();
            }

            result.push(cam);
        });

        return result;
    }

    addCamTerms(res) {
        const self = this;
        const result: Array<Entity> = [];

        res.forEach((response) => {
            const term = new Entity(
                self.curieUtil.getCurie(response.id.value),
                response.label.value
            );

            result.push(term);
        });

        return result;
    }

    calculateMatchedCountNumber(): number {
        const matchCount = this.camService.cams.reduce((total, currentValue) => {
            total += currentValue.matchedCount;
            return total;
        }, 0);

        return matchCount;
    }


    calculateMatched() {
        this.matchedEntities = this.camService.cams.reduce((total: Entity[], currentValue: Cam) => {
            if (currentValue.queryMatch && currentValue.queryMatch.terms) {
                total.push(...currentValue.queryMatch.terms);
            }

            return total;
        }, []);

        this.matchedCount = this.matchedEntities.length;
        this.matchedCountCursor = 0;
    }


    sortMatched() {
        this.matchedEntities = this.matchedEntities.sort(_compareEntityWeight)
    }

}
