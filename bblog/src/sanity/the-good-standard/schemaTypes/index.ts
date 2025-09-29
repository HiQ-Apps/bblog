import {type SchemaTypeDefinition} from 'sanity'
import post from './post'
import blockContent from './blockContent'
import affiliateProduct from './affiliateProduct'

export const schema: {types: SchemaTypeDefinition[]} = {
  types: [post, blockContent, affiliateProduct],
}
