import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NoctuaModule } from '@noctua/noctua.module';
import { NoctuaProgressBarModule } from '@noctua/components';
import { NoctuaSharedModule } from '@noctua/shared.module';
import { noctuaConfig } from './noctua-config';
import { AppComponent } from './app.component';
import { LayoutModule } from 'app/layout/layout.module';
import { AppsModule } from './main/apps/apps.module';
import {
    faAngleDoubleDown,
    faAngleDoubleLeft,
    faAngleDoubleRight,
    faAngleDoubleUp,
    faAngleLeft,
    faAngleRight,
    faArrowDown,
    faArrowUp,
    faBars,
    faCalendarDay,
    faCalendarWeek,
    faCaretDown,
    faCaretRight,
    faChartBar,
    faChevronDown,
    faChevronRight,
    faClipboardList,
    faClone,
    faCog,
    faComment,
    faCommentAlt,
    faCopy,
    faExclamationTriangle,
    faHistory,
    faInfoCircle,
    faLevelDownAlt,
    faLevelUpAlt,
    faLink,
    faList,
    faListAlt,
    faPaw,
    faPen,
    faPlus,
    faSave,
    faSearch,
    faSearchMinus,
    faSearchPlus,
    faShoppingBasket,
    faSitemap,
    faSortAlphaDown,
    faSortAlphaDownAlt,
    faTable,
    faTasks,
    faTimes,
    faUndo,
    faUser,
    faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { faBell, faCheckCircle, faTimesCircle, faTrashAlt, } from '@fortawesome/free-regular-svg-icons';
import { faGithub, faFacebook, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { NoctuaDataService } from '@noctua.common/services/noctua-data.service';
import { StartupService } from './startup.service';
import { TreeModule } from '@circlon/angular-tree-component';

export function startup(startupService: StartupService) {
    return () => startupService.loadData();
}

const appRoutes: Routes = [
    {
        path: '**',
        redirectTo: ''
    }
];

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        HttpClientJsonpModule,
        RouterModule.forRoot(appRoutes, { relativeLinkResolution: 'legacy' }),
        // Noctua Main and Shared modules
        NoctuaModule.forRoot(noctuaConfig),
        NoctuaSharedModule,
        LayoutModule,
        RouterModule,
        MatSidenavModule,
        NoctuaProgressBarModule,
        TreeModule,

        //Material 
        MatSidenavModule,

        //Noctua App 
        AppsModule
    ],
    providers: [
        StartupService,
        {
            provide: APP_INITIALIZER,
            useFactory: startup,
            deps: [StartupService, NoctuaDataService],
            multi: true
        }
    ],
    bootstrap: [
        AppComponent
    ]
})

export class AppModule {
    constructor(library: FaIconLibrary) {
        library.addIcons(
            faArrowUp,
            faArrowDown,
            faAngleDoubleLeft,
            faAngleDoubleRight,
            faAngleDoubleUp,
            faAngleDoubleDown,
            faAngleLeft,
            faAngleRight,
            faBars,
            faBell,
            faCalendarDay,
            faCalendarWeek,
            faCaretDown,
            faCaretRight,
            faChartBar,
            faChevronDown,
            faChevronRight,
            faCheckCircle,
            faClipboardList,
            faCog,
            faComment,
            faCommentAlt,
            faCopy,
            faClone,
            faExclamationTriangle,
            faFacebook,
            faGithub,
            faHistory,
            faInfoCircle,
            faLevelDownAlt,
            faLevelUpAlt,
            faLink,
            faList,
            faListAlt,
            faPaw,
            faPen,
            faPlus,
            faSave,
            faSearch,
            faSearchMinus,
            faSearchPlus,
            faShoppingBasket,
            faSitemap,
            faSortAlphaDown,
            faSortAlphaDownAlt,
            faTrashAlt,
            faTable,
            faTasks,
            faTimes,
            faTimesCircle,
            faTwitter,
            faUndo,
            faUser,
            faUsers,
        );
    }
}
