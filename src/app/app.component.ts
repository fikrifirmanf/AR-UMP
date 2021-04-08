import { Component, OnInit } from '@angular/core';
import { BuildingService } from './services/building.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'ar-ump';

  dataList:any
  constructor(private buildingServ: BuildingService){
    
  }
  ngOnInit(){
   
    this.showApi()
  }
  showApi(){
    this.buildingServ.getData().subscribe((resp)=>{
      console.log(resp)
    },(err)=>console.log(err))
  }

}
