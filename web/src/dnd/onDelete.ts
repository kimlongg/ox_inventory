import { getTargetInventory } from '../helpers';
import { store } from '../store';
import { DragSource, DropTarget, InventoryType, SlotWithItem } from '../typings';
import { removeSlots } from '../store/inventory';
import { Items } from '../store/items';
import { validateDelete } from '../thunks/validateItems';

export const onDelete = (source: DragSource, target?: DropTarget) => {
  const { inventory: state } = store.getState();

  const { sourceInventory, targetInventory } = getTargetInventory(state, source.inventory, target?.inventory);

  const sourceSlot = sourceInventory.items[source.item.slot - 1] as SlotWithItem;

  const sourceData = Items[sourceSlot.name];

  if (sourceData === undefined) return console.error(`${sourceSlot.name} item data undefined!`);

  // If dragging from container slot
  if (sourceSlot.metadata?.container !== undefined) {
    // Prevent storing container in container
    if (targetInventory.type === InventoryType.CONTAINER)
      return console.log(`Cannot store container ${sourceSlot.name} inside another container`);

    // Prevent dragging of container slot when opened
    if (state.rightInventory.id === sourceSlot.metadata.container)
      return console.log(`Cannot move container ${sourceSlot.name} when opened`);
  }

  // const targetSlot = target
  //   ? targetInventory.items[target.item.slot - 1]
  //   : findAvailableSlot(sourceSlot, sourceData, targetInventory.items);

  // if (targetSlot === undefined) return console.error('Target slot undefined!');

  const count =
    state.shiftPressed && sourceSlot.count > 1 && sourceInventory.type !== 'shop'
      ? Math.floor(sourceSlot.count / 2)
      : state.itemAmount === 0 || state.itemAmount > sourceSlot.count
        ? sourceSlot.count
        : state.itemAmount;

  const data = {
    fromSlot: sourceSlot,
    fromType: sourceInventory.type,
    count: count,
  };

  store.dispatch(validateDelete({ ...data, fromSlot: sourceSlot.slot }));

  store.dispatch(removeSlots(data));
};
