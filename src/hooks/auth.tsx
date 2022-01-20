import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

GoogleSignin.configure({
  webClientId:
    "831434801932-rui94j4og06r4d5q9aodsimuisq76hq5.apps.googleusercontent.com",
});

import auth from "@react-native-firebase/auth";
import { Alert } from "react-native";
import firestore from "@react-native-firebase/firestore";

import AsyncStorage from "@react-native-async-storage/async-storage";

type AuthContextData = {
  SignInEmailAndPassword: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  SignInWithGoogle: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  isLoading: boolean;
  user: User | null;
};

type AuthProviderProps = {
  children: ReactNode;
};

type User = {
  id: string;
  name: string;
  isAdmin: boolean;
};

const USER_COLLECTION = "@gopizza:users";

export const AuthContext = createContext({} as AuthContextData);

function AuthProvider({ children }: AuthProviderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const SignInEmailAndPassword = async (email: string, password: string) => {
    if (!email || !password) {
      return Alert.alert("Email e senha são obrigatórios");
    }

    setIsLoading(true);

    auth()
      .signInWithEmailAndPassword(email.trim(), password)
      .then((account) => {
        console.log(account);
        firestore()
          .collection("users")
          .doc(account.user.uid)
          .get()
          .then(async (profile) => {
            const { name, isAdmin } = profile.data() as User;

            if (profile.exists) {
              const useData = { id: account.user.uid, name, isAdmin };

              await AsyncStorage.setItem(
                USER_COLLECTION,
                JSON.stringify(useData)
              );
              setUser(useData);
            }
          });
      })
      .catch((error) => {
        const { code } = error;
        console.log(error);

        if (code === "auth/user-not-found" || code === "auth/wrong-password") {
          return Alert.alert("Login", "Email ou senha incorretos");
        } else {
          return Alert.alert("Login", "Erro ao fazer login");
        }
      })
      .finally(() => setIsLoading(false));
  };

  const SignInWithGoogle = async () => {
    setIsLoading(true);

    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const credential = auth.GoogleAuthProvider.credential(userInfo.idToken);

      await auth()
        .signInWithCredential(credential)
        .then((account) => {
          firestore()
            .collection("users")
            .doc(account.user.uid)
            .get()
            .then(async (profile) => {
              const { name, isAdmin } = profile.data() as User;

              if (profile.exists) {
                const useData = { id: account.user.uid, name, isAdmin };

                await AsyncStorage.setItem(
                  USER_COLLECTION,
                  JSON.stringify(useData)
                );
                setUser(useData);
              }
            });
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => setIsLoading(false));
    } catch (err) {
      console.log(err);
    }
  };

  const loadUser = async () => {
    setIsLoading(true);

    const storagedUser = await AsyncStorage.getItem(USER_COLLECTION);

    if (storagedUser) {
      const userData = JSON.parse(storagedUser) as User;

      setUser(userData);
    }

    setIsLoading(false);
  };

  const signOut = async () => {
    await auth().signOut();

    await AsyncStorage.removeItem(USER_COLLECTION);

    setUser(null);
  };

  const forgotPassword = async (email: string) => {
    if (!email) {
      return Alert.alert("Email é obrigatório");
    }

    auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        Alert.alert("Email enviado", "Verifique sua caixa de entrada");
      })
      .catch((error) => {
        console.log(error);
        Alert.alert("Erro ao enviar email", "Email não encontrado");
      });
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        SignInEmailAndPassword,
        isLoading,
        SignInWithGoogle,
        user,
        forgotPassword,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);

  return context;
}

export { AuthProvider, useAuth };
