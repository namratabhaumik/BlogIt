import { auth } from '../firebase';
import { browserLocalPersistence, browserSessionPersistence, confirmPasswordReset, createUserWithEmailAndPassword, deleteUser, EmailAuthProvider, reauthenticateWithCredential, sendPasswordResetEmail, setPersistence, signInWithEmailAndPassword, signOut, verifyBeforeUpdateEmail, updatePassword, applyActionCode } from "firebase/auth";

export const signUpUser = (email, password, context, successCallback, errorCallback) => {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      successCallback(userCredential, context);
      signOut(auth).then(() => {
        console.log("signOut successful");
      }).catch((error) => {
        console.log("signOut error!");
        console.log(error);
      })
    })
    .catch((error) => {
      errorCallback(error);
    })
}

export const signInUser = (email, password, enableLocalStorage, successCb, errorCb) => {
  if (enableLocalStorage) {
    setPersistence(auth, browserLocalPersistence);
  } else {
    setPersistence(auth, browserSessionPersistence);
  }

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      successCb(userCredential);
    })
    .catch((error) => {
      errorCb(error);
    })
}

export const signOutUser = () => {
  signOut(auth)
    .then(() => {
      console.log("Sign out successful");
    })
    .catch((error) => {
      console.log("Error signing out!");
    })
}

export const resetUserPassword = (email, successCb, errorCb) => {
  sendPasswordResetEmail(auth, email)
    .then(() => {
      successCb();
    })
    .catch((error) => {
      errorCb(error);
    });
}

export const confirmUserResetPassword = (oobCode, newPassword, successCb, errorCb) => {
  confirmPasswordReset(auth, oobCode, newPassword)
    .then(() => {
      successCb();
    })
    .catch((error) => {
      errorCb(error);
    });
}

export const reauthenticateUser = (email, password, successCb, errorCb) => {
  const user = auth.currentUser;
  const credential = EmailAuthProvider.credential(email, password);

  reauthenticateWithCredential(user, credential)
    .then(() => {
      successCb();
    })
    .catch((error) => {
      errorCb(error);
    });
}

export const deleteUserAccount = (successCb, errorCb) => {
  const user = auth.currentUser;

  deleteUser(user)
    .then(() => {
      successCb();
    })
    .catch((error) => {
      errorCb(error);
    });
}

export const updateUserPassword = (email, password, newPassword, successCb, errorCb) => {
  const user = auth.currentUser;
  const credential = EmailAuthProvider.credential(email, password);

  console.log(email, password, newPassword, successCb, errorCb);

  const changePass = (user, newPassword, successCb, errorCb) => {
    updatePassword(user, newPassword)
      .then(() => {
        successCb();
      })
      .catch((error) => {
        errorCb(error);
      });
  }

  reauthenticateWithCredential(user, credential)
    .then(() => {
      console.log("User reauthenticated");
      changePass(user, newPassword, successCb, errorCb);
    })
    .catch((error) => {
      console.log(error, errorCb);
      errorCb(error);
    });
}

export const updateUserEmail = (email, password, newEmail, successCb, errorCb) => {
  const user = auth.currentUser;
  const credential = EmailAuthProvider.credential(email, password);

  const changeEmail = (user, newEmail, successCb, errorCb) => {
    verifyBeforeUpdateEmail(user, newEmail)
      .then(() => {
        successCb();
      })
      .catch((error) => {
        errorCb(error);
      });
  };

  reauthenticateWithCredential(user, credential)
    .then(() => {
      console.log("User reauthenticated");
      changeEmail(user, newEmail, successCb, errorCb);
    })
    .catch((error) => {
      console.log(error, errorCb);
      errorCb(error);
    });
}

export const completeUserAction = (oobCode, successCb, errorCb) => {
  applyActionCode(auth, oobCode)
    .then(() => {
      successCb();
    })
    .catch((error) => {
      errorCb(error);
    })
}