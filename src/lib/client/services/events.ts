import {
  deleteEvent,
  fetchEvent,
  fetchEvents,
  saveEvent,
  updateEventStatus,
} from "@/lib/shared/services";
import { makeBrowserClient } from "../supabase";
import { EventInsert, Status } from "@/types";

export const fetchEventsByBrowser = async () => {
  const client = makeBrowserClient();
  return fetchEvents(client);
};

export const fetchEventByBrowser = async (id: string) => {
  const client = makeBrowserClient();
  return fetchEvent(client, id);
};

export const saveEventByBrowser = async (
  payload: EventInsert & { id?: string },
) => {
  const client = makeBrowserClient();
  return saveEvent(client, payload);
};

export const updateEventStatusByBrowser = async (
  id: string,
  status: Status,
) => {
  const client = makeBrowserClient();
  return updateEventStatus(client, id, status);
};

export const deleteEventByBrowser = async (id: string) => {
  const client = makeBrowserClient();
  return deleteEvent(client, id);
};
