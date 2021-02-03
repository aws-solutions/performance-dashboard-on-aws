import logger from "./logger";

async function handleModifiedItem(oldItem: any, newItem: any, timestamp: Date) {
  logger.info("Creating audit log entry for modified item");
  // TODO: Implement
}

async function handleCreatedItem(newItem: any, timestamp: Date) {
  logger.info("Creating audit log entry for new created item");
  // TODO: Implement
}

async function handleDeletedItem(oldItem: any, timestamp: Date) {
  logger.info("Creating audit log entry for deleted item");
  // TODO: Implement
}

export default {
  handleModifiedItem,
  handleCreatedItem,
  handleDeletedItem,
};
