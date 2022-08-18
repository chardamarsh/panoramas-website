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
  setMenuOpen(false);
}


const [menuMode, setMenuMode] = useState('0%') // changes sidebar sliding length based on if the site has photos.



const handle = useFullScreenHandle(); //handle used to open and close fullscreen.


const responsive = { //image carousel settings
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



const hiddenButtonRef = useRef(null); //hidden button refs used to reset photo pan/zoom when entering/exiting fullscreen.
//const hiddenButtonRef2 =useRef(null);



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
      <>
      <div>     
        <button className="enterfullscreen" onClick={resetZoomPanEnter}>Fullscreen</button>
        <button className="hiddenbuttonenter" onClick={handle.enter}></button>
        </div> 
        <div className="fullscreencontainer">
          <FullScreen handle={handle}>
            <Carousel responsive={responsive} draggable={false} partialVisible={false} infinite={true} arrows={images.length > 1}>  
              {images}
            </Carousel>
            <button className="exitfullscreen" onClick={resetZoomPanExit}>x</button>
            <button className="hiddenbuttonexit" onClick={handle.exit}></button>
          </FullScreen>
        </div>
        <div className="controls">
          <p>You can use your mouse or touchscreen to pan and zoom these images.</p>  
      </div>
      </>
        
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
      <>
        <div>     
          <button className="enterfullscreen" onClick={resetZoomPanEnter}>Fullscreen</button>
          <button className="hiddenbuttonenter" onClick={handle.enter}></button>
        </div> 
        <div className="fullscreencontainer">
          <FullScreen handle={handle}>
            <Carousel responsive={responsive} draggable={false} partialVisible={false} infinite={true} arrows={images.length > 1}>
              {images}
            </Carousel>
            <button className="exitfullscreen" onClick={resetZoomPanExit}>x</button>
            <button className="hiddenbuttonexit" onClick={handle.exit}></button>
          </FullScreen>
        </div>
        <div className="controls">
          <p>You can use your mouse or touchscreen to pan and zoom these images.</p>  
        </div>
      </>
        )
}

else{ //Site does not have any images associated with it.
return;
}
};



const resetZoomPanEnter= () =>
{
  var enterElements = document.querySelector('.hiddenbuttonenter')//Hidden button used to enter fullscreen.
  enterElements.click();
  var elements = document.querySelectorAll('.hiddenbutton')//activates hidden buttons connected to each photo in the photo carousel. Used to reset pan/zoom when entering fullscreen.
  for(let i = 0; i < elements.length; i++)
  {
  elements[i].click();
  }
}

const resetZoomPanExit= () =>
{
  //handle.exit;
  var exitElements = document.querySelector('.hiddenbuttonexit')//Hidden button used to exit fullscreen.
  exitElements.click();
  var elements = document.querySelectorAll('.hiddenbutton')//activates hidden buttons connected to each photo in the photo carousel. Used to reset pan/zoom when entering fullscreen.
  for(let i = 0; i < elements.length; i++)
  {
  elements[i].click();
  }
}

/*const [showAbout, setAboutOpen] = useState(false);

const openAbout= () =>
{
  setAboutOpen(true);
}

const aboutMenu= () => {
if(showAbout === true)
{ 
  setMenuOpen(true);
  setMenuMode('50%');
return(
<div className="aboutsite">
  <p><b>The Osborne Panoramas</b> are a collection of 3,093 panoramic images taken from fire lookouts in Oregon and Washington, between 1929 and 1941,
  using a specially designed camera. At each fire lookout, three pictures each encompassing a 120-degrees of angle were taken. The original 5 x 13 prints, shown here as digital files,
  are housed at the National Archives and Records Administration in Seattle, WA.</p>

<p>The initial aim of this website is to show replicated work, alongside the original Osborne Panoramas. Ultimately, the site may display all of the quality historic panoramas,
  whether replicated or not. John Marshall was introduced to the Osborne Panoramas in 2010 by the U.S. Forest Service and the Pacific Northwest Research Station.
  As of this writing Marshall has replicated over 200 panoramas with funding from a variety of entities, and independently.
  Conventional tripod-based photography using a DSLR camera and panoramic head is the preferred method for replication. In places where fire towers no longer exist, or trees block the view,
  unmanned-aerial-systems are deployed. The primary aim is to get an accurate match of the background. Height and position may result in an imperfect match of foreground.</p>

<p><b>Technical Notes-</b>While the image quality seen here is quite good, files have been reduced in size to load rapidly on the web.
 Historic images were scanned at 600 pixels per inch resulting in an image area 7,700 pixels wide, not including black borders.
  The native resolution of DSLR panoramas may be over 14,000 pixels wide. On display here are 3,800 pixels wide images.</p>

<p><b>About Copyright-</b> The historic images are all in the public domain. But, public domain does not guarantee publicly accessible files.
 For Oregon there is easy access to historic Osborne Panoramas through a website owned by The Nature Conservancy. 
 Among the replicated panoramas displayed on this site, some were contracted by state or federal government, and are therefore in the public domain.
  John Marshall owns copyright to all panoramic replications not generated under government contract.</p>

<p><b>Public Display-</b> This website is designed for personal use, government or academic research, and for display before a live audience such as in a lecture hall. 
  Please seek permission from the authors of this site, before incorporating any display or portion of a display into a separate product or presentation. 
  Permission must also accompany any stand-alone display of this website in a public space.</p>
</div>
)
}
}*/




  return (

  
  <div id="outer-container">
    <div className="header">
    <div className="header-left">
      <div className="icon">
        <img className="iconimg" src={cameraicon} alt="icon"></img>
      </div>
      <div className="title">
        Osborne Panoramas
      </div>
      
    </div>
      <div className="header-right">
      <div className="infoLinks">
          <div>
            <a href="https://github.com/chardamarsh/panoramas-website#readme" target="_blank" rel="noreferrer">About This Site <strong>↗</strong></a>
          </div>
        </div>
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
      
          {getImages([originalImageLinks], [replicationImageLinks])}
          
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
                  setMenuOpen(false); //Sites without pictures will not open the picture sidebar.
                 
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