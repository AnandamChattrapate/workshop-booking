import * as eventService from "../services/eventService.js";
import { parseId } from "./params.js";

export async function listEvents(req, res) {
  const items = await eventService.listEvents();
  return res.json({ items });
}

export async function getEvent(req, res) {
  const id = parseId(req.params.id);
  const event = id && (await eventService.getEvent(id));

  if (!event) {
    return res.status(404).json({ error: "Event not found" });
  }
  return res.json(event);
}

export async function listAdminEventSummaries(req, res) {
  const items = await eventService.getAdminEventSummaries();
  return res.json({ items });
}
