import { useRouter } from 'expo-router'
import { useState } from 'react'
import { useShallow } from 'zustand/react/shallow'

import { AstryxEmptyState } from '@components/astryx/AstryxPrimitives'
import InputSheet from '@components/views/InputSheet'
import { Characters } from '@lib/state/Characters'
import { Logger } from '@lib/state/Logger'

const CharactersEmpty = () => {
    const router = useRouter()
    const [showCreate, setShowCreate] = useState(false)
    const [creating, setCreating] = useState(false)
    const setCurrentCard = Characters.useCharacterStore(
        useShallow((state) => state.setCard)
    )

    const createCharacter = async (name: string) => {
        if (creating) return
        setCreating(true)
        try {
            const id = await Characters.db.mutate.createCard(name)
            await setCurrentCard(id)
            router.push('/screens/CharacterEditorScreen')
        } catch (error) {
            Logger.errorToast('Could not create character')
            Logger.error(JSON.stringify(error))
        } finally {
            setCreating(false)
        }
    }

    return (
        <>
            <AstryxEmptyState
                icon="person-search"
                title="No characters yet"
                description="Create an assistant or import a character card to start chatting."
                actionLabel="Create character"
                onAction={() => setShowCreate(true)}
            />
            <InputSheet
                visible={showCreate}
                setVisible={setShowCreate}
                title="Create New Character"
                placeholder="Name..."
                autoFocus
                onConfirm={createCharacter}
                verifyText={(name) => (name.trim().length === 0 ? 'Name cannot be empty' : '')}
            />
        </>
    )
}

export default CharactersEmpty
