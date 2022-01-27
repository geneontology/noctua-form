import { AfterViewInit, Component, Input, NgZone, OnInit } from '@angular/core';
import Reveal from 'reveal.js';
import Markdown from 'reveal.js/plugin/markdown/markdown.esm.js';
import Highlight from 'reveal.js/plugin/highlight/highlight.esm.js';
import { ActivityDisplayType, Cam } from '@geneontology/noctua-form-base';
import { TableOptions } from '@noctua.common/models/table-options';


@Component({
  selector: 'noctua-basic-tutorial',
  templateUrl: './basic-tutorial.component.html',
  styleUrls: ['./basic-tutorial.component.scss']
})
export class BasicTutorialComponent implements OnInit, AfterViewInit {

  @Input('cam')
  cam: Cam

  tableOptions: TableOptions = {
    displayType: ActivityDisplayType.TREE,
    slimViewer: false,
    editableTerms: true,
    editableEvidence: true,
    editableReference: true,
    editableWith: true,
    editableRelation: true,
    showMenu: true
  };

  constructor(private zone: NgZone) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      Reveal.initialize(
        {
          controls: true,
          progress: true,
          history: true,
          center: true,
          mouseWheel: true,
          transition: 'slide',
          controlsLayout: 'edges',
          controlsBackArrows: 'visible',
          width: '90%',
          height: '100%',
          plugins: [
            Markdown,
            Highlight,
          ]
        }
      );
    }, 2000)
  }

}
