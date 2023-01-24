import { BeaconActor } from "../../actor/Beacon-actor";

export interface StructStressData {
  title: string;
  stat: "structure" | "stress";
  BeaconActor?: BeaconActor;
}
