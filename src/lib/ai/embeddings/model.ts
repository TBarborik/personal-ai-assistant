import "server-only";
import path from "node:path";
import {
  env,
  pipeline,
  type FeatureExtractionPipeline,
} from "@huggingface/transformers";

export const EMBEDDING_MODEL_ID = "Xenova/multilingual-e5-small";
export const EMBEDDING_DIMENSIONS = 384;
export const EMBEDDING_MODEL_VERSION = `${EMBEDDING_DIMENSIONS}:q8:v1`

env.cacheDir = path.resolve(
  process.env.MODEL_STORAGE_DIR ?? "./storage/models",
);
env.useFSCache = true;
let modelPromise: Promise<FeatureExtractionPipeline> | undefined;

export function getEmbeddingModel() {
  modelPromise ??= pipeline("feature-extraction", EMBEDDING_MODEL_ID, {
    device: "cpu",
    dtype: "q8",
  }).catch((error) => {
    modelPromise = undefined;
    throw error;
  });

  return modelPromise;
}
