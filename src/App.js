import React, { useState, setState, useEffect, useRef, useLayoutEffect, Component, useCallback } from 'react';

import './App.css';
import './menuStyle.css';

import { Amplify } from 'aws-amplify';
import awsconfig from './aws-exports';


import { MapContainer, TileLayer, useMap, Marker, Popup, setCenter, Tooltip } from 'react-leaflet';
import {LayersControl} from 'react-leaflet/LayersControl';
import { LayerGroup } from 'react-leaflet/LayerGroup';
//import { FeatureGroup } from 'react-leaflet/FeatureGroup';
//import L from 'leaflet';


import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';


import { slide as Menu } from 'react-burger-menu';
//import panzoom from 'panzoom';

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import { FullScreen, useFullScreenHandle } from "react-full-screen";


import siteList from './resources/Panorama-sites-list-updated3.json';
import cameraicon from './resources/thumbnail_Osborne.png';


Amplify.configure(awsconfig);

function App() {

const recreatedSites = siteList.filter(siteList => siteList.repDirections !== "");
const allOtherSites = siteList.filter(siteList => siteList.imgFolder ==="")
//const originalSites = siteList.filter(siteList => siteList.imgOriginal !== "");
//const unscannedSites = siteList.filter(siteList => siteList.imgOriginal === "");
const imgSource = "https://panoramas-website-storage-f38d7055203555-staging.s3.us-west-1.amazonaws.com/panoramaimages-marked";
//console.log(recreatedSites);
//console.log(originalSites);

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
//const [siteInfo, setSiteInfo] = useState(["","","","","","","",""]) // used to display site information in the side menu.
//const[mapCenter, setMapCenter] = useState([45.60, -125.38])
//const map = useMap();


const handle = useFullScreenHandle();


const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
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



const getImages = ([orlink], [replink]) => {
  if(orlink[0] !=='' && replink[0] !=='') //site has both original and replication images.
  {
  
      const images = [];
      for (let i = 0; i < replink.length; i++) {
          images.push(
        //<React.Fragment>   
          <div className="carouselelement">
            
            <TransformWrapper>
            
              <TransformComponent>
                <img className ="panoimage" src={orlink[i]} alt="originalpanorama"/>
              </TransformComponent>
            </TransformWrapper>
            <TransformWrapper>
            
              <TransformComponent>
                <img className ="panoimage" src={replink[i]} alt="originalpanorama"/>
              </TransformComponent>
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
              
              <TransformComponent>
                <img className ="panoimageOriginal" src={orlink[i]} alt="originalpanorama"/>
              </TransformComponent>
            </TransformWrapper>
            </div>
            );
          }
        }
      return (
        
          <Carousel responsive={responsive} draggable={false} partialVisible={false}>
            
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
          
          <Carousel responsive={responsive} draggable={false} partialVisible={false}>
            {images}
          </Carousel>
        )
}

else{
return;
}
};


/*
function displayGallery([orLinkList], [repLinkList]) {
  if (orLinkList[0] !== '') {
    return (
          
          <React.Fragment>
          <div className="originalimgs">
           {orLinkList.map(orLinks =>(
           <img src={orLinks} alt="originalimg"/>))
          } 
          </div>
          <div className="replicationimgs">
           {repLinkList.map(repLinks =>(
           <img src={repLinks} alt="replicationimg"/>))
          } 
          </div>
          </React.Fragment>
         );
          
  }
  return;
}*/



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
            <p>Photo Replications By</p>
            <p>John F. Marshall <strong>↗</strong></p>
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
      <button className="enterfullscreen" onClick={handle.enter}>Fullscreen</button>
      </div>
      <div className="fullscreencontainer">
      <FullScreen handle={handle}>
      
      {getImages([originalImageLinks], [replicationImageLinks])}
      <button className="exitfullscreen" onClick={handle.exit}>x</button>
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
                  //setMenuOpen([false]);
                  //console.log('marker clicked', site)
                  setRepLinks(["","","",""]); //resetting the links here in order to make sure images from previously clicked marker is not included.
                  setOrLinks(["","","",""]);
                  //console.log('links all sites', originalImageLinks[0] !== '');
                  //console.log('is menu open',isMenuOpen);
                  //setMenuOpen(true);
                  setMenuOpen(false);
                  //setMenuMode('0%');
                  
                  //setSiteInfo([site.SiteName, site.Forest, site.County, site.ElevationFeet, site.Latitude, site.Longitude, site.TRSM, site.USGS75Min]);
                  //setSiteInfo([site.id, site.Forest, site.County, site.ElevationFeet, site.Latitude, site.Longitude, site.TRSM, site.USGS75Min]);
                  //console.log('site info', siteInfo[0]);
                  //setMapCenter([site.Latitude, site.Longitude]);
                  //map.([site.Latitude, site.Longitude])
                  //console.log(mapCenter);
                  //console.log(isMenuOpen);
                  //console.log('links all sites', originalImageLinks);
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
                click: (e) => {
                  
                  var tempOriginal = recSite.orDirections.split(" ");
                  var tempReplication = recSite.repDirections.split(" ");
                  //console.log(tempReplication);
                  //console.log(tempOriginal);
                  var numLinks = tempOriginal.length;
                  for(var i = 0; i < tempReplication.length; i++)
                  {
                    tempReplication[i] = imgSource + recSite.imgFolder + tempReplication[i] + '/' + tempReplication[i] + '-Replication.jpg';
                  }
                  for(var i = 0; i < tempOriginal.length; i++)
                  {
                    tempOriginal[i] = imgSource + recSite.imgFolder + tempOriginal[i] + '/' + tempOriginal[i] + '-Original.jpg';
                  }
                  
                  //console.log('is menu open',isMenuOpen);
                  //setMenuOpen(true);
                  //setMenuOpen(false);
                  //console.log(isMenuOpen, 'why close');
                  //setMenuMode('40%');
                  //console.log('rep',tempReplication);
                  //console.log('orig',tempOriginal);
                  setRepLinks(tempReplication);
                  setOrLinks(tempOriginal);
                  setMenuMode('50%');
                  setMenuOpen(true);
                  //console.log('links', getImages(originalImageLinks, replicationImageLinks));
                  //console.log(getImages([originalImageLinks], [replicationImageLinks]));

                  
                  
                  
                  
                  //setSiteInfo([recSite.SiteName, recSite.Forest, recSite.County, recSite.ElevationFeet, recSite.Latitude, recSite.Longitude, recSite.TRSM, recSite.USGS75Min]);
                  //console.log('site info', siteInfo[0]);
                  //setMapCenter([recSite.Latitude, recSite.Longitude]);
                  //map.setCenter([recSite.Latitude, recSite.Longitude])
                  //console.log(mapCenter);
                  

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
          {/*<LayersControl.Overlay name="Sites With Only Historical Images">
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


/*import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { listNotes } from './graphql/queries';
import { createNote as createNoteMutation, deleteNote as deleteNoteMutation } from './graphql/mutations';

const initialFormState = { name: '', description: '' }

function App() {
  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    const apiData = await API.graphql({ query: listNotes });
    setNotes(apiData.data.listNotes.items);
  }

  async function createNote() {
    if (!formData.name || !formData.description) return;
    await API.graphql({ query: createNoteMutation, variables: { input: formData } });
    setNotes([ ...notes, formData ]);
    setFormData(initialFormState);
  }

  async function deleteNote({ id }) {
    const newNotesArray = notes.filter(note => note.id !== id);
    setNotes(newNotesArray);
    await API.graphql({ query: deleteNoteMutation, variables: { input: { id } }});
  }

  return (
    <div className="App">
      <h1>My Notes App</h1>
      <input
        onChange={e => setFormData({ ...formData, 'name': e.target.value})}
        placeholder="Note name"
        value={formData.name}
      />
      <input
        onChange={e => setFormData({ ...formData, 'description': e.target.value})}
        placeholder="Note description"
        value={formData.description}
      />
      <button onClick={createNote}>Create Note</button>
      <div style={{marginBottom: 30}}>
        {
          notes.map(note => (
            <div key={note.id || note.name}>
              <h2>{note.name}</h2>
              <p>{note.description}</p>
              <button onClick={() => deleteNote(note)}>Delete note</button>
            </div>
          ))
        }
      </div>
      <AmplifySignOut />
    </div>
  );
}

export default withAuthenticator(App);









<LayersControl position="topright">
      <LayersControl.Overlay name="All Sites">
        {siteList.map(site => (
        <Marker
        key = {site.id}
        position = {[site.Latitude, site.Longitude]}
        eventHandlers={{
          click: (e) => {
            console.log('marker clicked', e)
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
        </Marker>
        ))}
      </LayersControl.Overlay>
      <LayersControl.Overlay checked name="Recreated Sites">
        {recreatedSites.map(site => (
        <Marker
        key = {site.id}
        position = {[site.Latitude, site.Longitude]}
        eventHandlers={{
          click: (e) => {
            console.log('marker clicked', e)
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
        </Marker>
        ))}
      </LayersControl.Overlay>
      <LayersControl.Overlay name="Sites with Only Historical Images">
        {originalSites.map(site => (
          <Marker
          key = {site.id}
          position = {[site.Latitude, site.Longitude]}
          eventHandlers={{
            click: (e) => {
              console.log('marker clicked', e)
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
          </Marker>
          ))}
        </LayersControl.Overlay>
        </LayersControl>








*/