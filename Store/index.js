import { createStore, createHooks } from "react-global-hook";

const initialState = {
  cards: {
      1: {
          face: 'gold',
          state: 'rest'
      },
      2: {
          face: 'gold',
          state: 'rest'
      },
      3: {
          face: 'gold',
          state: 'raised'
      },
      4: {
          face: 'diamond',
          state: 'rest'
      },
      5: {
          face: 'gold',
          state: 'raised'
      }
  },
  players: {
      1:{
        nickName: "Uzair",
        turn: false,
      },
      2:{
        nickName: "Yawer",
        turn: true
      },
      3:{
        nickName: "Ahmed",
        turn: false
      },
      4:{
        nickName: "Shazad",
        turn: false
      }
  },
  thisPlayer:3

};

const actions = ({ setState, getState }) => ({
  UpdateCards(newCards) {
    const { cards } = getState();
    setState({
      cards: {
          ...cards, ...newCards
    }
    });
  },
  updatePlayers(newPlayers) {
    const { players } = getState();
    setState({
      players: {
          ...players, ...newPlayers
    }
    });
  },
  changeCardState(position) {
    const {cards} = getState();

    console.log(cards[position]);

    if (cards[position].state == "rest") {
        cards[position].state = "raised";
    }
    else if (cards[position].state == "raised") {
        cards[position].state = "dispatched";
        cards[position].face = "none";
    }
    else if (cards[position].state == "dispatched") {
        cards[position].state = "rest";
    }

    for (let a = 1; a <= 5; a++) {
        if (position !== a) {
            cards[a].state = "rest";
        }
    }

    
    setState({cards: {
        ...cards
    }});
  }
});

export const Store = createStore(initialState, actions);

//Store.addListener(state => return let s =0;);

export const useStore = createHooks(Store);
