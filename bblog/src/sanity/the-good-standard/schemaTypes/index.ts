import { type SchemaTypeDefinition } from "sanity";
import post from "./post";
import blockContent from "./blockContent";
import amazonEmbed from "./amazonEmbed";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [post, blockContent, amazonEmbed],
};
