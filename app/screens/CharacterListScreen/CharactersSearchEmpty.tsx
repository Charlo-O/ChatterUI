import { AstryxEmptyState } from '@components/astryx/AstryxPrimitives'

const CharSearchEmpty = () => {
    return (
        <AstryxEmptyState
            icon="search"
            title="No matching characters"
            description="Try a different name or clear the active filters."
        />
    )
}

export default CharSearchEmpty
