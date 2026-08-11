# Demo Pedidos Firebase - Maqueta alumnos

Maqueta alineada con la solución docente actual.

Objetivo: completar y entender el flujo:

```txt
Firebase Auth -> usuario
Firestore     -> pedidos
Base64        -> imagen comprimida como string
```

## Ejecutar

```bash
npm install
npx expo start -c
```

## Configuración requerida

En Firebase Console:

```txt
Authentication -> Email/Password activo
Firestore Database -> creado
Reglas Firestore -> abiertas para demo
```

Reglas demo:

```js
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

## Qué debe revisar/completar el alumno

```txt
TODO 1  -> firebaseConfig
TODO 2  -> addDoc
TODO 3  -> query + where por userId
TODO 4  -> updateDoc
TODO 5  -> deleteDoc
TODO 6  -> createUserWithEmailAndPassword
TODO 7  -> updateProfile
TODO 8  -> signInWithEmailAndPassword
TODO 9  -> signOut
TODO 10 -> comprimir imagen y convertir a Base64
TODO 11 -> onAuthStateChanged
TODO 12 -> login desde pantalla
TODO 13 -> registro desde pantalla
TODO 14 -> cargar pedidos por usuario
TODO 15 -> crear pedido
```

## Flujo visual

```txt
LoginScreen
  ├─ Crear cuenta -> RegisterScreen
  └─ Iniciar sesión -> HomePedidosScreen

HomePedidosScreen
  ├─ Crear pedido
  ├─ Seleccionar evidencia Base64
  ├─ Listar pedidos
  ├─ Cambiar estado
  └─ Eliminar pedido
```

## Logs para clase

```txt
[AUTH LOGIN]
[AUTH REGISTER]
[AUTH SESSION]
[FIRESTORE CREATE]
[FIRESTORE READ]
[FIRESTORE UPDATE]
[FIRESTORE DELETE]
[IMAGE BASE64]
```

## Nota docente

Esta maqueta usa Base64 para evitar Firebase Storage/Blaze.

Es útil para clase, pero en producción se recomienda:

```txt
Imagen -> Storage -> URL -> Firestore
```

