import React from 'react';

export function Dashboard(props: any) {

    return <div style={{margin: "auto"}}>
        <h1>Bine ai venit!</h1>
        <div>Pentru a completa un test trebuie sa accesezi link-ul catre testul din sesiunea activa.</div>
        <div><a href="/login">Login</a> pentru a putea administra testele.</div>
    </div>;
}
