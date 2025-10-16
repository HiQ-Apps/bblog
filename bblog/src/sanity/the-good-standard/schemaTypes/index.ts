import { type SchemaTypeDefinition } from "sanity";
import post from "./post";
import blockContent from "./blockContent";
import amazonEmbed from "./amazonEmbed";
import amazonProduct from "./amazonProduct";
import productCard from "./productCard";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [post, blockContent, amazonEmbed, amazonProduct, productCard],
};
