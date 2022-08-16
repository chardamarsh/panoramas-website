import React, { useState, setState, useEffect, useRef, useLayoutEffect, Component, useCallback } from 'react';

import './App.css';
import './menuStyle.css';

import { Amplify } from 'aws-amplify';
import awsconfig from './aws-exports';


import { MapContainer, TileLayer, useMap, Marker, Popup, setCenter, Tooltip } from 'react-leaflet';
import {LayersControl} from 'react-leaflet/LayersControl';
import { LayerGroup } from 'react-leaflet/LayerGroup';


import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';


import { slide as Menu } from 'react-burger-menu';

import { TransformWrapper, TransformComponent, ReactZoomPanPinchRef } from "react-zoom-pan-pinch";

import { FullScreen, useFullScreenHandle } from "react-full-screen";


import siteList from './resources/Panorama-sites-list-updated.json';
import cameraicon from './resources/thumbnail_Osborne.png';


Amplify.configure(awsconfig);

function App() {

const recreatedSites = siteList.filter(siteList => siteList.repDirections !== "");// Sites with original photos only and unscanned sites to be added to filter list.
const allOtherSites = siteList.filter(siteList => siteList.imgFolder ==="")

const imgSource = "https://panoramas-website-storage-f38d7055203555-staging.s3.us-west-1.amazonaws.com/panoramaimages-marked";


const [originalImageLinks, setOrLinks] = useState(["","","",""])
const [replicationImageLinks, setRepLinks] = useState(["","","",""]) //array length may need to change if some sites have more than 4 directions.
const [isMenuOpen, setMenuOpen] = useState(false)//used to open sidebar when a marker is clicked.

const handleIsOpen = () => {
  setMenuOpen(!isMenuOpen)
}

const closeSideBar = () => {
  setMenuOpen(false)
}


const [menuMode, setMenuMode] = useState('0%') // changes sidebar sliding length based on if the site has photos.



const handle = useFullScreenHandle();


const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 1
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 1
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1
  }
};



const hiddenButtonRef = useRef(null);
const hiddenButtonRef2 =useRef(null);
//const {resetButton} = () =>{ hiddenButtonRef.current.resetTransform();



const getImages = ([orlink], [replink]) => {
  if(orlink[0] !=='' && replink[0] !=='') //site has both original and replication images.
  {
  
      const images = [];
      for (let i = 0; i < replink.length; i++) {
          images.push(
        //<React.Fragment>   
          <div className="carouselelement">
            
            <TransformWrapper>
            {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
              <>
              <button className="hiddenbutton" ref={hiddenButtonRef} onClick={()=>resetTransform()}></button>
              <TransformComponent>
                <img className ="panoimage" src={orlink[i]} alt="originalpanorama"/>
              </TransformComponent>
              </>
            )}
            </TransformWrapper>
            <TransformWrapper>
            {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
              <>
              <button className="hiddenbutton" ref={hiddenButtonRef} onClick={()=>resetTransform()}></button>
              <TransformComponent>
                <img className ="panoimage" src={replink[i]} alt="originalpanorama"/>
              </TransformComponent>
              </>
            )}
            </TransformWrapper>
          </div>
          //</React.Fragment>       
          );
          }
        if(orlink.length > replink.length) // Site has some directions which were not replicated.
        {
          for(let i=orlink.length-1; i>replink.length-1; i--)
          {
            images.push(
            <div className="carouselelement-single">  
              <TransformWrapper>
              {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
              <>
              <button className="hiddenbutton" ref={hiddenButtonRef} onClick={()=>resetTransform()}></button>
              <TransformComponent>
                <img className ="panoimageOriginal" src={orlink[i]} alt="originalpanorama"/>
              </TransformComponent>
              </>
              )}
            </TransformWrapper>
            </div>
            );
          }
        }
      return (
        
          <Carousel responsive={responsive} draggable={false} partialVisible={false} infinite={true} arrows={images.length > 1}>
            
            {images}
          </Carousel>
        
      );

}
else if(orlink[0] !=='' && replink[0] ==='') //site only has original images.
{
  const images = [];
      for (let i = 0; i < replink.length; i++) {
          images.push(

            <div className="carouselelement-single">
              <TransformWrapper wrapperStyle="panzoomsingle">
              <TransformComponent>
                <img className ="panoimageOriginal" src={orlink[i]} alt="originalpanorama"/>
              </TransformComponent>
            </TransformWrapper>
            </div>

          )
        }

        return(
          
          <Carousel responsive={responsive} draggable={false} partialVisible={false} infinite={true} arrows={images.length > 1}>
            {images}
          </Carousel>
        )
}

else{
return;
}
};



const resetZoomPanEnter= () =>
{
  //handle.enter;
  //hiddenButtonRef.current.click();
  //hiddenButtonRef2.current.click();
  var exitElements = document.querySelector('.hiddenbuttonenter')
  exitElements.click();
  var elements = document.querySelectorAll('.hiddenbutton')
  for(let i = 0; i < elements.length; i++)
  {
  elements[i].click();
  }
}

const resetZoomPanExit= () =>
{
  //handle.exit;
  var exitElements = document.querySelector('.hiddenbuttonexit')
  exitElements.click();
  var elements = document.querySelectorAll('.hiddenbutton')
  for(let i = 0; i < elements.length; i++)
  {
  elements[i].click();
  }
}









  return (

  
  <div id="outer-container">
    <div className="header">
    <div className="header-left">
      <div className="icon">
        <img className="iconimg" src={cameraicon} alt="icon"></img>
      </div>
      <div className="title">
        Osborne Panoramas Map
      </div>
      
    </div>
      <div className="header-right">
      <div className="infoLinks">
        <div>
          <a href="https://www.wildlandnw.net/osborne-panoramas-historic-and-modern" target="_blank" rel="noreferrer">More Information <strong>↗</strong></a>
        </div>
      </div>
      <div className="infoLinks">
        <div>
          <a href="https://www.jfmarshall.com/" target="_blank" rel="noreferrer">
            <p>Photo Replications</p>
            <p>By John F. Marshall <strong>↗</strong></p>
          </a>
        </div>
      </div>
        <div className="createdby">
          <p>Website By</p>
          <p>Charles Marshall</p>
        </div>
        
        <div className="socialicons">
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"/>
          <a href="https://www.linkedin.com/in/charles-marshall-56ba81204/" target="_blank" rel="noreferrer" className="fa fa-linkedin"></a>
          <a href="https://github.com/chardamarsh" target="_blank" rel="noreferrer" className="fa fa-github"></a>
        </div>
      </div>
    </div>
      

    <Menu pageWrapId={ "page-wrap" } outerContainerId={ "outer-container" } isOpen={isMenuOpen} onOpen={handleIsOpen}
    onClose={handleIsOpen} width={menuMode} noOverlay>
     
      <div>     
      <button className="enterfullscreen" onClick={resetZoomPanEnter}>Fullscreen</button>
      <button className="hiddenbuttonenter" onClick={handle.enter}></button>
      </div>
      <div className="fullscreencontainer">
      <FullScreen handle={handle}>
      
      {getImages([originalImageLinks], [replicationImageLinks])}
      <button className="exitfullscreen" onClick={resetZoomPanExit}>x</button>
      <button className="hiddenbuttonexit" onClick={handle.exit}></button>
      </FullScreen>
      </div>
      <div className="controls">
        <p>You can use your mouse or touchscreen to pan and zoom these images.</p>
        
      </div>
      
    </Menu>













      <main id="page-wrap"> 
  <MapContainer center={[45.60, -125.38]} zoom={6} scrollWheelZoom={true} zoomControl={false}>
  
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />

       <LayersControl position="topright">
        {
          <LayersControl.Overlay name="All Other Sites">
          <LayerGroup>
                    {allOtherSites.map(site => (
              <Marker
              key = {site.id}
              position = {[site.Latitude, site.Longitude]}
              eventHandlers={{
                click: (e) => {
               
                  setRepLinks(["","","",""]); //resetting the links here in order to make sure images from previously clicked marker is not included.
                  setOrLinks(["","","",""]);
                  setMenuOpen(false);
                 
                },
              }}>
                <Popup>
                <div className="sidebar">
                  <b>Site Name: </b> {site.SiteName}<br />
                  <b>Forest:  </b> {site.Forest}<br />
                  <b>County:  </b> {site.County}<br />
                  <b>Elevation in Feet: </b>: {site.ElevationFeet}<br />
                  <b>Latitude:  </b> {site.Latitude}<br />
                  <b>Longitude: </b> {site.Longitude}<br />
                  <b>Township, Range, Section, Meridian:  </b> {site.TRSM}<br />
                  <b>USGS 7.5 min. map: </b> {site.USGS75Min}<br />
                </div>
                </Popup>
                <Tooltip>{site.SiteName}</Tooltip>
              </Marker>
            ))}    
            </LayerGroup>
          </LayersControl.Overlay>
          }
          <LayersControl.Overlay checked name="Replicated Sites">
              <LayerGroup>
                    {recreatedSites.map(recSite => (
              <Marker
              key = {recSite.id}
              position = {[recSite.Latitude, recSite.Longitude]}
              eventHandlers={{
                click: (e) => { //Generates image source links when a marker is clicked.
                  
                  var tempOriginal = recSite.orDirections.split(" ");
                  var tempReplication = recSite.repDirections.split(" ");
                 
                  var numLinks = tempOriginal.length;
                  for(var i = 0; i < tempReplication.length; i++)
                  {
                    tempReplication[i] = imgSource + recSite.imgFolder + tempReplication[i] + '/' + tempReplication[i] + '-Replication.jpg';
                  }
                  for(var i = 0; i < tempOriginal.length; i++)
                  {
                    tempOriginal[i] = imgSource + recSite.imgFolder + tempOriginal[i] + '/' + tempOriginal[i] + '-Original.jpg';
                  }
                  
                  setRepLinks(tempReplication);
                  setOrLinks(tempOriginal);
                  setMenuMode('50%');
                  setMenuOpen(true);
                  
                },
              }}>
                <Popup className="imageInfo">
                
                <div className="sidebar">
                  <b>Site Name: </b> {recSite.SiteName}<br />
                  <b>Forest:  </b> {recSite.Forest}<br />
                  <b>County:  </b> {recSite.County}<br />
                  <b>Elevation in Feet: </b>: {recSite.ElevationFeet}<br />
                  <b>Latitude:  </b> {recSite.Latitude}<br />
                  <b>Longitude: </b> {recSite.Longitude}<br />
                  <b>Township, Range, Section, Meridian:  </b> {recSite.TRSM}<br />
                  <b>USGS 7.5 min. map: </b> {recSite.USGS75Min}<br />
                </div>
                
                
                
                </Popup>
                <Tooltip>{recSite.SiteName}</Tooltip>
              </Marker>
            ))}    
            </LayerGroup>
          </LayersControl.Overlay>
          { 
          
          
          //**********************************To be added - Unscanned Panorama Sites and Sites with only original photos.******************************
          
          
          /*<LayersControl.Overlay name="Sites With Only Historical Images">
              <LayerGroup>
                    {originalSites.map(orSite => (
              <Marker
              key = {orSite.id}
              position = {[orSite.Latitude, orSite.Longitude]}
              eventHandlers={{
                click: (e) => {
                  console.log('marker clicked', e)
                },
              }}>
                <Popup>
                <div className="sidebar">
                  <b>Site Name: </b> {orSite.SiteName}<br />
                  <b>Forest:  </b> {orSite.Forest}<br />
                  <b>County:  </b> {orSite.County}<br />
                  <b>Elevation in Feet: </b>: {orSite.ElevationFeet}<br />
                  <b>Latitude:  </b> {orSite.Latitude}<br />
                  <b>Longitude: </b> {orSite.Longitude}<br />
                  <b>Township, Range, Section, Meridian:  </b> {orSite.TRSM}<br />
                  <b>USGS 7.5 min. map: </b> {orSite.USGS75Min}<br />
                </div>
                </Popup> 
              </Marker>
            ))}    
            </LayerGroup>
          </LayersControl.Overlay>



          <LayersControl.Overlay name="Unscanned Sites">
              <LayerGroup>
                    {unscannedSites.map(unSite => (
              <Marker
              key = {unSite.id}
              position = {[unSite.Latitude, unSite.Longitude]}
              eventHandlers={{
                click: (e) => {
                  console.log('marker clicked', e)
                },
              }}>
                <Popup>
                <div className="sidebar">
                  <b>Site Name: </b> {unSite.SiteName}<br />
                  <b>Forest:  </b> {unSite.Forest}<br />
                  <b>County:  </b> {unSite.County}<br />
                  <b>Elevation in Feet: </b>: {unSite.ElevationFeet}<br />
                  <b>Latitude:  </b> {unSite.Latitude}<br />
                  <b>Longitude: </b> {unSite.Longitude}<br />
                  <b>Township, Range, Section, Meridian:  </b> {unSite.TRSM}<br />
                  <b>USGS 7.5 min. map: </b> {unSite.USGS75Min}<br />
                </div>
                </Popup> 
              </Marker>
            ))}    
            </LayerGroup>
            </LayersControl.Overlay>*/}
        </LayersControl>
   
  </MapContainer>
    
      </main>
  </div>
  
  );
}

export default App;