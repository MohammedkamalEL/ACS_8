import { useLocalStorage } from "./useLocalStorage";

const EMPTY_PROFILE = {
  name: "",
  bloodType: "",
  allergies: "",
  conditions: "",
  medications: "",
};

const makeId = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

export function usePersonalContacts() {
  const [contacts, setContacts] = useLocalStorage("sos.contacts", []);

  const addContact = (contact) =>
    setContacts((list) => [...list, { ...contact, id: makeId() }]);

  const removeContact = (id) => setContacts((list) => list.filter((c) => c.id !== id));

  return { contacts, addContact, removeContact };
}

export function useMedicalProfile() {
  const [profile, setProfile] = useLocalStorage("sos.profile", EMPTY_PROFILE);

  const saveProfile = (next) => setProfile({ ...EMPTY_PROFILE, ...next });

  return { profile: { ...EMPTY_PROFILE, ...profile }, saveProfile };
}
