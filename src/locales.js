/**
 * Локалізації. Ключ — код мови (з webpack DefinePlugin: language).
 * У компонентах: localizationMap.get(lang).key або fallback localizationMap.get("en").
 */
const data = {
  en: {
    scanDone: "Done!",
    scanAnalyze: "Analyze",
    scanHintComplete: "Choose folders to clean up with ease!",
    scanHintInitial: "Scan mailbox to find clutter",
    scanning: "Scanning…",
    hintFreeSpace: "0 mb free space",
    unwantedFiles: "unwanted files found",
    spaceFreed: "MB of space freed",
    clear: "Clear",
    modalCopy: "100% of unwanted files cleared! {totalFreed} MB has been freed",
    downloadCta: "Download app for iOS",
    categories: ["Spam", "Promotions", "Newsletters"],
  },
  uk: {
    scanDone: "Готово!",
    scanAnalyze: "Аналізувати",
    scanHintComplete: "Обирай папки та очищуй їх легко!",
    scanHintInitial: "Скануй пошту, щоб знайти непотрібне",
    scanning: "Сканування…",
    hintFreeSpace: "0 МБ вільного місця",
    unwantedFiles: "непотрібних файлів",
    spaceFreed: "МБ звільнено",
    clear: "Очистити",
    modalCopy: "100% непотрібних файлів видалено! Звільнено {totalFreed} МБ",
    downloadCta: "Завантажити застосунок для iOS",
    categories: ["Спам", "Реклама", "Розсилки"],
  },
};

const localizationMap = new Map(Object.entries(data));
export default localizationMap;
