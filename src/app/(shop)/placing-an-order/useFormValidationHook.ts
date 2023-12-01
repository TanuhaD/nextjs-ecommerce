import { useEffect, useState } from "react";

import { PlaceOrderResult } from "./action";

export const useFormValidationHook = (state: PlaceOrderResult) => {
  const [nameValidationMessage, setNameValidationMessage] = useState("");
  const [emailValidationMessage, setEmailValidationMessage] = useState("");
  const [phoneValidationMessage, setPhoneValidationMessage] = useState("");
  const [addressValidationMessage, setAddressValidationMessage] = useState("");
  const [commentsValidationMessage, setCommentsValidationMessage] =
    useState("");
  const removeValidationMessage = (editingInput: string) => {
    switch (editingInput) {
      case "name":
        setNameValidationMessage("");
        break;
      case "email":
        setEmailValidationMessage("");
        break;
      case "phone":
        setPhoneValidationMessage("");
        break;
      case "address":
        setAddressValidationMessage("");
        break;
      case "comments":
        setCommentsValidationMessage("");
        break;
    }
  };
  useEffect(() => {
    state?.validationErrors?.name
      ? setNameValidationMessage(state?.validationErrors.name)
      : "";
    state?.validationErrors?.email
      ? setEmailValidationMessage(state?.validationErrors?.email)
      : "";
    state?.validationErrors?.phone
      ? setPhoneValidationMessage(state?.validationErrors?.phone)
      : "";
    state?.validationErrors?.address
      ? setAddressValidationMessage(state?.validationErrors?.address)
      : "";
    state?.validationErrors?.comments
      ? setCommentsValidationMessage(state?.validationErrors?.comments)
      : "";
  }, [state]);

  return {
    nameValidationMessage,
    emailValidationMessage,
    phoneValidationMessage,
    addressValidationMessage,
    commentsValidationMessage,
    removeValidationMessage,
  };
};
