import Sheet from "./Sheet";
import styles from "./OptionList.module.css";

// Liste hvor man vælger én ting, fx "Lyd" eller "Varighed af snooze"
export default function OptionList({ title, options, selected, onSelect, onClose }) {
  return (
    <Sheet title={title} onClose={onClose}>
      <div className={styles.list}>
        {options.map((option) => (
          <button
            key={option}
            className={option === selected ? styles.selected : styles.option}
            onClick={() => {
              onSelect(option);
              onClose();
            }}
          >
            {option}
          </button>
        ))}
      </div>
    </Sheet>
  );
}
