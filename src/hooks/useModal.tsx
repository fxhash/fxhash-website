import React, { useCallback, useState } from "react"

interface ModalState {
  isOpen: boolean
  openModal: () => void
  closeModal: () => void
}

interface ModalProps {
  onClose: () => void
}

export const useModal = <TProps extends ModalProps>(
  ModalComponent: React.FC<TProps>,
  modalProps?: Omit<TProps, "onClose"> & {
    showModalOnRender?: boolean
  }
): [ModalState, React.ReactElement] => {
  const [isOpen, setIsOpen] = useState(modalProps?.showModalOnRender ?? false)

  const handleToggleModal = useCallback(
    (newState) => () => setIsOpen(newState),
    []
  )

  const openModal = handleToggleModal(true)
  const closeModal = handleToggleModal(false)

  const props = {
    ...modalProps,
    onClose: closeModal,
  } as TProps

  return [
    {
      isOpen,
      openModal,
      closeModal,
    },
    // eslint-disable-next-line react/jsx-key
    <ModalComponent {...props} />,
  ]
}
