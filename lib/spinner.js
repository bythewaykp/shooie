import Styles from "./spinner.module.css";

let Spinner = () => {
    return (
        <div className={Styles.ringbound}>
            <div className={Styles.ring}></div>
            <div className={Styles.ring}></div>
            <div className={Styles.ring}></div>
            <div className={Styles.ring}></div>
        </div>
    );
};

export default Spinner;
