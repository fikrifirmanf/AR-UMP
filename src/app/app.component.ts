import { Component, OnInit } from '@angular/core';
import { BuildingService } from './services/building.service';
import {MatDialog} from '@angular/material/dialog';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import { Subject } from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'ar-ump';
  destroyed = new Subject<void>();
  currentScreenSize: string | undefined;

  // Create a map to display breakpoint names for demonstration purposes.
  displayNameMap = new Map([
    [Breakpoints.XSmall, 'XSmall'],
    [Breakpoints.Small, 'Small'],
    [Breakpoints.Medium, 'Medium'],
    [Breakpoints.Large, 'Large'],
    [Breakpoints.XLarge, 'XLarge'],
  ]);
  dataList: any
  constructor(breakpointObserver: BreakpointObserver,private buildingServ: BuildingService, public dialog: MatDialog){
    breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge,
    ]).pipe(takeUntil(this.destroyed)).subscribe(result => {
        for (const query of Object.keys(result.breakpoints)) {
          if (result.breakpoints[query]) {
            this.currentScreenSize = this.displayNameMap.get(query) ?? 'Unknown';
            console.log(this.currentScreenSize)
          }
        }
    });
  }
  ngOnInit(){
  //  screen.orientation.lock('landscape')
    this.showApi()
  }
  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }
  openDialog() {
    this.dialog.open(MapDialog);
  }
  aboutDialog(){
    this.dialog.open(AboutDialog)
  }
  
  showApi(){
  
      const scene = document.querySelector('a-scene');
      const uu = <HTMLElement> document.querySelector('#location__dispaly')
      const lookAt = '[gps-camera]'
    this.buildingServ.getData().subscribe((resp)=>{
      console.log(resp)
      this.dataList = resp["data"]
      resp["data"]
      for (let i = 0; i < resp["data"].length; i++) {
        // add place name
      
        const placeText = document.createElement('a-image');
       
        const h1 = <HTMLElement> document.createElement('h1')
        h1.style.cssText = 'color:white'
        placeText.setAttribute('look-at', lookAt);
        placeText.setAttribute('gps-entity-place', `latitude: ${resp["data"][i]["lat"]}; longitude: ${resp["data"][i]["long"]};`);
        placeText.setAttribute('src', resp["data"][i]["imgurl"]);
        // placeText.setAttribute('geometry', 'primitive:plane');
        // placeText.setAttribute('width', '5');
        // placeText.setAttribute('height', '3.5');
        placeText.setAttribute('scale', '5 5 5')
        
        h1.innerText = `latitude: ${resp["data"][i]["lat"]}; longitude: ${resp["data"][i]["long"]};`
        
        // placeText.setAttribute('scale', '15 15 15');
        // placeText.setAttribute('scale', '15 15 15');
        placeText.addEventListener('loaded', () => {
            window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'));
        });

        scene?.appendChild(placeText);
        // uu?.appendChild(h1)
        
      }
        
      });
      // const h2 = document.createElement('h2')
      // navigator.geolocation.getCurrentPosition((position)=>{
      //   h2.innerText = `latku = ${position.coords.latitude.toString()} lonku = ${position.coords.longitude.toString()}`
      // })
      // h2.style.cssText = 'color:white'
      
      // uu?.appendChild(h2)
      const distanceMsg =  document.querySelector('[gps-entity-place]')?.getAttribute('distanceMsg');
console.log(distanceMsg); 
    }
}
@Component({
  selector: 'map-dialog',
  templateUrl: 'widget/map-dialog.html',
})
export class MapDialog implements OnInit {
  dataMap: any
  map!: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11';

  zoom = 15
  lat: number = -7.412207679837826;
  lng: number = 109.27170037031276;
  constructor(private buildingServ: BuildingService){ (mapboxgl as any).accessToken = environment.mapbox.accessToken;}
  
  ngOnInit(){
   

    // this.buildingServ.getData().subscribe((resp)=>{
    //   console.log(resp)
    //   this.dataMap = resp["data"]}, (err)=>{
    //     console.log(err)
    //   })
    this.buildMap()
      
  }
  buildMap() {
    this.buildingServ.getData().subscribe((resp)=>{
      for (let i = 0; i < resp["data"].length; i++) {
        
        const marker1 = new mapboxgl.Marker()
  .setLngLat([resp["data"][i]['long'], resp["data"][i]['lat']]).setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
  .setHTML('<h4>' + resp["data"][i]['name'] + '</h4><p>' + resp["data"][i]['desc'] + '</p>'))
  .addTo(this.map);
      }
    },(err)=>console.log(err))
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: this.zoom,
      center: [this.lng, this.lat]
    })
   this.map.addControl(new mapboxgl.NavigationControl());
   
  }
}
@Component({
  selector: 'about-dialog',
  templateUrl: 'widget/about-dialog.html',
})
export class AboutDialog implements OnInit {
  
  myIP:any
  constructor(private buildingServ: BuildingService){ }
  
  ngOnInit(){
    
    // this.buildingServ.getIP().subscribe((resp)=>{
    //   this.myIP = resp.ip
    //   console.log(resp.ip)
    // },(err)=>console.log(err))
    
  }
}
