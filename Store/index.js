import { createStore, createHooks } from "react-global-hook";

const initialState = {

  selectedTruck : null,
  selectedDriver : null,
  selectedClient: null,
  selectedThings : null,
  selectedConfig: null,
  currentTrip: null,
  currentPin:null,
  loggedInEmail: null,
  loggedInName: null,
  loggedInRole: 'driver'
};

const actions = ({ setState, getState }) => ({
  updateSelectedTruck(truck) {
    const { selectedTruck } = getState();
    setState({
      selectedTruck: truck
    });
  },
  updateSelectedDriver(driver) {
    const { selectedDriver } = getState();
    setState({
      selectedDriver: driver
    });
  },
  updateSelectedClient(client) {
    const { selectedClient } = getState();
    setState({
      selectedClient: client
    });
  },
  
  updateSelectedThings(things) {
    const { selectedDriver } = getState();
    setState({
      selectedThings: 
        things
      
    });
  },
  updateSelectedConfig(config) {
    const { selectedConfig } = getState();
    setState({
      selectedConfig: 
        config
      
    });
  },
  updateCurretnPin(pin) {
    const { currentPin } = getState();
    setState({
      currentPin: 
        pin
      
    });
  },
  updateCurrentTrip(trip) {
    const { currentTrip } = getState();
    setState({
      currentTrip: 
        trip
      
    });
  },
  updateCurrntUser(name, email, role) {

    setState({
      loggedInEmail: email,
        loggedInName:name,
        loggedInRole: role
      
    });
  }
  

});

export const Store = createStore(initialState, actions);

export const useStore = createHooks(Store);
