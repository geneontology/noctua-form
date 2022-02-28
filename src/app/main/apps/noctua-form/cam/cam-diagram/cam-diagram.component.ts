
import { Component, OnInit, Input } from '@angular/core';
import { NoctuaFormConfigService } from '@geneontology/noctua-form-base';
import { NoctuaActivityFormService } from '@geneontology/noctua-form-base';
import { CamDiagramService } from './services/cam-diagram.service';
import { Cam } from '@geneontology/noctua-form-base';

@Component({
  selector: 'noc-cam-diagram',
  templateUrl: './cam-diagram.component.html',
  styleUrls: ['./cam-diagram.component.scss']
})
export class CamDiagramComponent implements OnInit {
  title = 'Angular JsPlumb Integration';

  @Input('cam')
  public cam: Cam

  jsPlumbInstance;
  showConnectionToggle = false;
  buttonName = 'Connect';
  nodes = [];

  constructor(
    public noctuaFormConfigService: NoctuaFormConfigService,
    public noctuaActivityFormService: NoctuaActivityFormService,
    public camDiagramService: CamDiagramService) {
  }

  getPosition(el) {
    let x = 0;
    let y = 0;
    while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
      x += el.offsetLeft - el.scrollLeft;
      y += el.offsetTop - el.scrollTop;
      el = el.offsetParent;
    }
    return { top: y, left: x };
  }

  ngOnInit() { }

  addNode(name: string) {
    this.nodes = [name];
  }

  showConnectOnClick() {
    this.showConnectionToggle = !this.showConnectionToggle;
    if (this.showConnectionToggle) {
      this.buttonName = 'Dissconnect';
      this.connectSourceToTargetUsingJSPlumb();
    } else {
      this.buttonName = 'Connect';
      this.jsPlumbInstance.reset();
    }
  }

  connectSourceToTargetUsingJSPlumb() {
    let labelName;
    labelName = 'connection';
    this.jsPlumbInstance.connect({
      connector: ['Flowchart', { stub: [212, 67], cornerRadius: 1, alwaysRespectStubs: true }],
      source: 'Source',
      target: 'Target1',
      anchor: ['Right', 'Left'],
      paintStyle: { stroke: '#456', strokeWidth: 4 },
      overlays: [
        ['Label', { label: labelName, location: 0.5, cssClass: 'connectingConnectorLabel' }]
      ],
    });
  }
}
