import { FC,  useEffect,  useState } from "react";
import { Button, FloatingLabel, Form, Spinner } from "react-bootstrap";
import { JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import { trpcClient } from "../services/trpc";
import { Wallet } from "./static-data";
import AsyncButton from "./AsyncButton";
// import ProvideMetamaskEncryptionKeyButton from "./provide-metamask-encryption-key-button";

type Props = {
  provider: Web3Provider | JsonRpcProvider
  signedInAddress: string
  wallet: Wallet | null
  onSuccess?: () => void
};

const UpdateMyWalletForm: FC<Props> = ({
  provider,
  signedInAddress,
  wallet,
  onSuccess
}) => {

  const [loading, setLoading] = useState(false);
  const [myPublicKey, setMyPublicKey] = useState("");

  useEffect(()=>{
    setMyPublicKey(wallet?.public_key || '');
  }, [wallet])

  return <Form onSubmit={async(e)=>{
    setLoading(true)
    e.preventDefault()
    e.stopPropagation()
    try {
      const payload = {
        address: signedInAddress,
        public_key: myPublicKey
      }
      const message = JSON.stringify(payload)
      const signature = await provider.getSigner().signMessage(message)
      console.log('posting message', message, signature)
      const data = await trpcClient.mutation('wallet.update', {
        ...payload,
        signature
      })
      console.log('updated',data)
      if (onSuccess) onSuccess()
    } catch (error) {
      console.error('trpc error;', error)
    }

    setLoading(false)
  }}>
    <FloatingLabel className="mb-2" controlId="myPublicKeyInput" label="Public Key">
      <Form.Control as="textarea" style={{height: '6em'}} placeholder="RSA Public Key" value={myPublicKey} onChange={(e)=>{ setMyPublicKey(e.currentTarget.value) }}/>
    </FloatingLabel>
{/*

Commented out for now because Metamask decrypt is slow.

    {  provider instanceof Web3Provider && !!wallet?.metamask_encrypted_public_key ?
      <p>Your Metamask encryption key was provided.</p> :
      <ProvideMetamaskEncryptionKeyButton provider={provider} signedInAddress={signedInAddress} onSuccess={onSuccess} />
   }
*/}

    <AsyncButton
      className="w-100 mb-3"
      variant="primary"
      loading={loading}
      type="submit"
    >Update</AsyncButton>

  </Form>

}

export default UpdateMyWalletForm;