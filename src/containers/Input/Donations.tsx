import style from "./Donations.module.scss"
import cs from "classnames"
import text from "../../styles/Text.module.css"
import { Button } from "../../components/Button"
import { useState } from "react"
import { Modal } from "../../components/Utils/Modal"
import { UserDonationAliases } from "../../utils/user"
import { ipfsGatewayUrl } from "../../services/Ipfs"
import { Spacing } from "../../components/Layout/Spacing"

interface Props {
  onClickDonation: (address: string) => void
}
export function Donations({
  onClickDonation,
}: Props) {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <Button
        type="button"
        size="very-small"
        iconComp={<i className="fa-solid fa-plus" aria-hidden/>}
        onClick={() => setShowModal(!showModal)}
      >
        donations
      </Button>

      {showModal && (
        <Modal
          title="Add a donation address"
          onClose={() => setShowModal(false)}
        >
          <span className={cs(text.info)}>
            These addresses are endorsed by fxhash as belonging to their respective organisations.
          </span>

          <Spacing size="regular"/>

          <div className={cs(style.buttons_container)}>
            {Object.keys(UserDonationAliases).map(address => (
              <button
                key={address}
                onClick={() => {
                  onClickDonation(address)
                  setShowModal(false)
                }}
              >
                <img 
                  alt={`${UserDonationAliases[address].name} logo`}
                  src={ipfsGatewayUrl(UserDonationAliases[address].avatarUri)}
                />
                <div className={cs(style.donation_content)}>
                  <strong>{UserDonationAliases[address].name}</strong>
                  <span className={cs(style.donation_description)}>
                    {UserDonationAliases[address].descriptionLight}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </Modal>
      )}
    </>
  )
}