import Sheet from "../Sheet/Sheet";
import styles from "./OptionList.module.css";

export default function OptionList({ title, options, selected, onSelect, onClose }) {
  return (
    <Sheet title={title} onClose={onClose}>
      {(close) => (
        <div className={styles.list}>
          {options.map((option) => (
            <button
              key={option}
              className={option === selected ? styles.selected : styles.option}
              onClick={() => {
                onSelect(option);
                close();
              }}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </Sheet>
  );
}
