import { CaseReducer, PayloadAction } from '@reduxjs/toolkit';
import { getTargetInventory, itemDurability } from '../helpers';
import { Inventory, SlotWithItem, State } from '../typings';

export const removeSlotsReducer: CaseReducer<
  State,
  PayloadAction<{
    fromSlot: SlotWithItem;
    fromType: Inventory['type'];
  }>
> = (state, action) => {
  const { fromSlot, fromType } = action.payload;
  const { sourceInventory } = getTargetInventory(state, fromType);

  sourceInventory.items[fromSlot.slot - 1] =
  {
    slot: fromSlot.slot,
  };
};
