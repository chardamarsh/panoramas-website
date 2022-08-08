import React, { useState, useEffect } from 'react';
import './App.css';
//import { API } from 'aws-amplify';
import { MapContainer, TileLayer, useMap, Marker, Popup, LayersControl } from 'react-leaflet';
//import { Storage } from "@aws-amplify/storage";
//import Papa from 'papaparse';
//import './Panorama-sites-list.csv';
import L from 'leaflet';
import siteList from './resources/Sites-List.json';


function App() {

const recreatedSites = siteList.filter(siteList => siteList.imgRecreated !== "");
const originalSites = siteList.filter(siteList => siteList.imgOriginal !== "");
console.log(recreatedSites);
console.log(originalSites);


  return (
    
  <MapContainer center={[45.60, -125.38]} zoom={6} scrollWheelZoom={true}>
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />

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


   
  </MapContainer>
    
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