import path from 'path'
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);
import { loadFilesSync } from '@graphql-tools/load-files'
import { mergeTypeDefs } from '@graphql-tools/merge'

const typesArray = loadFilesSync(path.join(__dirname, '../graphql'), { extensions: ['graphql'] })

mergeTypeDefs(typesArray)
export default typesArray;