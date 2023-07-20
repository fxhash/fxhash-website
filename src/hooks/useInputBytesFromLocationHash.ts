export function useInputBytesFromLocationHash(): string | undefined {
  return global?.window?.location?.hash?.replace("#0x", "") || undefined
}
