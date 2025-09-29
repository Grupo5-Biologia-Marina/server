import { Router } from "express";
import {
  createDiscover,
  getDiscovers,
  getDiscoverById,
} from "../controllers/discoverController";

const router = Router();

// POST → crear un descubrimiento
router.post("/", createDiscover);

// GET → obtener todos los descubrimientos
router.get("/", getDiscovers);

// GET → obtener un descubrimiento por ID
router.get("/:id", getDiscoverById);

export default router;