import { Component, OnInit,Renderer, Inject,ViewChild, ElementRef, Directive , Input} from '@angular/core';
import { Pipe, PipeTransform } from '@angular/core';
//import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { ConcertAllService } from '../concert-all.service';
import { Concert2 } from '../couch-base.class';
import { SongDetail } from '../couch-base.class';
import {TrackElement} from '../couch-base.class';


import {PlayerService} from '../../audio-player/audio-player.service';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
 
@Component({
  selector: 'concert-Select',
  templateUrl: './concert-select.html',
  styleUrls: ['./concert-select.css'],
  providers: [ConcertAllService,PlayerService]
})


export class ConcertSelectComponent implements OnInit {
    Concerts: Observable<Concert2 []>
   @Input() selectConcert : Concert2;
   selectSongs : Array<SongDetail>;
   @Input() song: TrackElement;
   yearText : string;
   mmddText : string;//=this.getMMDD();
   private onNextCalled : boolean = false;
   public total_rows  :   number ;
   public offset : number;
   public trackSelected : boolean;
   firstTime : boolean = true;
   @Input() public trackName : string;
   @Input() public selectTrackArray : Array<TrackElement>; 
   public myTime : string="000";
 
  constructor(private service: ConcertAllService, private _playerService: PlayerService) {
    
    this.trackSelected=false; 
  
 }
   onToggle(){
     this._playerService.toggleAudio();
   }
   onPlay(){
     console.log("concert-select.components::onPlay.");
    this._playerService.setPlayer(this.song);
    this._playerService.play();
   }
onNextTrack(){
  console.log("concert-select.components::onNextTrack");
  if (this.firstTime){
    this.firstTime=false;
    return;
  }
  if (!this.song){
    let t : number = 0;
    if (this.selectTrackArray)
    {
      this.song = this.selectTrackArray[t];
      this.onNext(this.song);
      this.onPlay();
    }
    return;
  }
  let nextTrack : number  = Number( this.song.track); //this is the track number = offset of next track
  if (nextTrack == this.selectTrackArray.length){
            nextTrack=0;
    }
      this.song = this.selectTrackArray[nextTrack];
      //console.log("concert-select::OnNextTrack:::Calling OnNextB");
      this.onNext(this.song);
      this.onPlay();
  }
  
  onStop(){
    this._playerService.pause();
  }
  onShow(){
    alert(" Track: "+this.song.name+ " Track Number: " +this.song.track + " Time: "+this.song.length);
  }

  onSelectTrack(track : TrackElement): void{ 
    console.log("concert-select.components::onSelectTrack");
     if (this.onNextCalled){
       this.onNextCalled=false;
       return;
     }
     this.trackSelected=true;

     this.trackName=track.name;
     this.song=track;
this.onPlay();
}
onNext(track : TrackElement): void{ 
     console.log("concert-select.components::onNext");
     this.trackSelected=true;
    
     this.trackName=track.name;
     this.song=track;
     this.onNextCalled=true;
     this.onPlay();
    }


ngOnInit() {}
   

  ngOnChanges(){
    this._playerService.endEvent.subscribe(t => this.onNextTrack());
    this.onPlay();
    this.firstTime   = true;
    this._playerService.audio.addEventListener("timeupdate", ()=>this.updateProgress());
    this.myTime="0.000";
  }

  updateProgress(){
      console.log("B "+this._playerService.audio.currentTime);
      let x=this._playerService.audio.currentTime.toString();
      let y=this.myTime;
      let z=x.indexOf('.');
      console.log('Index: '+z);
      console.log('Input: '+x);
      x=x.substr(0,z );
      console.log('Output: ' +x);
      y=y.substr(0,z );
      if (x!=y){
      this.myTime=(this._playerService.audio.currentTime.toString().substr(0,4));
      }
    }
}

