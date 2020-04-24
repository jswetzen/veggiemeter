import { createSlice } from "@reduxjs/toolkit";
import { uiStateRef, veggieCheckerRef } from "../../config/firebase"

export const uiStateSlice = createSlice({
  name: 'uiState',
  initialState: {
    value: {
      names: ["Laddar..."],
      veggies: ["Laddar..."],
      veggieChecks: {},
      selectedName: "",
      selectedDay: "today",
    },
    },
    reducers: {
      selectName: (state, action) => {
        // Redux Toolkit allows us to write "mutating" logic in reducers. It
        // doesn't actually mutate the state because it uses the Immer library,
        // which detects changes to a "draft state" and produces a brand new
        // immutable state based off those changes
        if (state.value.names.includes(action.payload)) {
            uiStateRef.child('selectedName').set(action.payload);
            // state.value.selected = action.payload;
        }
      },
    addName: (state, action) => {
      uiStateRef.names.add(action.payload);
    },
    setNames: (state, action) => {
        state.value = action.payload;
    }
  },
});

export const veggieCheckerSlice = createSlice({
    name: 'checks',
    initialState: {
        value: {today: {}},
    },
    reducers: {
        check: (state, action) => {
          const {day, name, veggie, checked} = action.payload;
          const update = {};
          update[veggie] = !checked;
          veggieCheckerRef.child(`${day}/${name}`).update(update);
          uiStateRef.child(`veggieChecks/${veggie}`).transaction((veggieCount) => {
            if (veggieCount !== null) {
              veggieCount++;
            }
            return veggieCount;
          });
        },
        setChecks: (state, action) => {
            state.value = action.payload;
        }
    }
});

export const { selectName, setNames, addName } = uiStateSlice.actions;
export const { check, setChecks } = veggieCheckerSlice.actions;

export const selectUIState = state => state.uiState.value;
export const selectNames = state => state.uiState.value.names;
export const selectedDay = state => state.uiState.value.selectedDay;
export const selectedName = state => state.uiState.value.selectedName;
export const selectVeggies = state => {
  const checks = state.checks.value;
  const day = state.uiState.value.selectedDay;
  const name = state.uiState.value.selectedName;
  const veggies = state.uiState.value.veggieChecks;
  const hasChecks = day in checks && name in checks[day];
  return Object.keys(veggies).sort(
    (a, b) => veggies[b]-veggies[a]).map((v) =>
    ({
      name: v,
      checked: hasChecks && checks[day][name][v] === true,
    })
    );
}
export const selectChecks = state => state.checks.value;

export const fetchUIState = () => async (dispatch) => {
  uiStateRef.on("value", (snapshot) => {
    setTimeout(() => {
      dispatch(uiStateSlice.actions.setNames(snapshot.val()));
    });
  });
};
export const fetchChecks = () => async (dispatch) => {
  veggieCheckerRef.on("value", (snapshot) => {
    setTimeout(() => {
      dispatch(veggieCheckerSlice.actions.setChecks(snapshot.val()));
    });
  });
};

export const uiStateReducer = uiStateSlice.reducer;
export const veggieCheckerReducer = veggieCheckerSlice.reducer;