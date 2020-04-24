import React, { Component, /*useState*/ } from "react";
import { useSelector, useDispatch, connect } from "react-redux";
import styles from "./VeggieMeter.module.css";
import { selectName, selectUIState, selectVeggies, check, fetchUIState, fetchChecks, selectedDay, selectedName } from "./veggieSlice"

import { apple } from './apple.png'

/*
const Name = ({name}) => {
    return <span className={styles.name}>{name}</span>;
};
*/

class VeggieMeterComponent extends Component {
    componentDidMount() {
        this.props.fetchUIState();
        this.props.fetchChecks();
    }

    render() {
        return(
            <div>
                <NamePicker />
                <VeggieChecker />
            </div>
        )
    }
}

class NamePickerComponent extends Component {
    render() {
        const uiState = this.props;
        return (
        <div className={`${styles.row} ${styles.namePicker}`}>
            {[...uiState.names].map(n =>
            <div
                key={`nameButton${n}`}
                className={`${styles.button} ${n === uiState.selectedName ? styles.buttonActive : ""}`}
                aria-label={n} 
                onClick={() => this.props.selectName(n)}
            >{n}</div>
            )}
        </div>
        )
    }
}

const Star = ({visible}) => {
    var style = {
        visible: visible ? "visible" : "none",
    };
    return <span className={styles.star} style={{display: visible ? 'visible' : 'none'}}>★</span>;
}

const VeggieButton = ({name, day, veggie, checked}) => {
    const dispatch = useDispatch();
    const starStyle = {
        display: checked ? "visible" : "none",
    };
    return <div
        className={`${styles.button} ${styles.veggieButton} ${checked ? styles.buttonActive : ""}`}
        aria-label={veggie}
        style={{ backgroundImage:`url("/veggies/${veggie}.png")` }}
        onClick={() => dispatch(check({name: name, day: day, veggie: veggie, checked: checked}))}
    >
        <span className={styles.star}>{checked ? "★" : ""}</span>
    </div>;
};

export function VeggieChecker() {
  const veggies = useSelector(selectVeggies);
  const day = useSelector(selectedDay);
  const name = useSelector(selectedName);
  const dispatch = useDispatch();
  
  return (
            <div className={styles.veggieList}>
                {[...veggies].map(v =>
                <VeggieButton key={v.name} name={name} day={day} veggie={v.name} checked={v.checked} />
                )}
            </div>
  )
}


export const NamePicker = connect(selectUIState, {fetchUIState, selectName})(NamePickerComponent);
export const VeggieMeter = connect(null, {fetchUIState, fetchChecks})(VeggieMeterComponent);
