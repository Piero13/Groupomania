<template>

<div>
    <PageHeader/>

    <main id="main" class="main">
        <div class="profile">
            <div class="profile__image">
                <img src="../assets/image_profil_default.jpg" alt="">
            </div>

            <div class="profile__modif">
                <button class="form__btn profile__btn">Modifier Image du profil</button>

                <button @click="showModifPassword = true" class="form__btn profile__btn">Modifier Mot de passe</button>
            </div>

            <div class="profile__infos">
                <div class="pi__user">
                    <input type="text" placeholder="Nom" aria-label="Nom" class="pi__user__lastname">

                    <input type="text" placeholder="Prénom" aria-label="Prénom" class="pi__user__firstname">

                    <textarea type="text" placeholder="Description" aria-label="Description" class="pi__user__description"></textarea>
                </div>

                <div v-if="showModifPassword" class="pi__password">
                    <button @click="showModifPassword = false">X</button>

                    <label for="pi__password__old">Ancien mot de passe</label>
                    <input type="password" placeholder="Ancien mot de passe" id="pi__password__old">

                    <label for="pi__password__new">Nouveau mot de passe</label>
                    <input type="password" placeholder="Nouveau mot de passe" id="pi__password__new">

                    <label for="pi__password__confirm">Confirmer mot de passe</label>
                    <input type="password" placeholder="Confirmer mot de passe" id="pi__password__old">
                </div>

                <div class="pi__save">
                    <button class="form__btn profile__btn">Enregistrer</button>
                </div>
            </div>
        </div>
    </main>

    <PageFooter/>
</div>

</template>

<script>

import PageHeader from "../components/PageHeader.vue";
import PageFooter from "../components/PageFooter.vue";
import { mapActions, mapGetters } from "vuex";

export default {
    data() {
        return {
            showModifPassword: false,
            oldPassword: null,
            newPassword: null,
            lastname: null,
            firstname: null,
            description: null
        }
    },
    computed: {
        ...mapGetters({ user: "showConnectedUser "})
    },
    methods: {
        ...mapActions([ "getOneUser "])
    },
    components: {
        PageHeader,
        PageFooter
    }
}
</script>

<style lang="scss">

.profile {
    display: flex;
    justify-content: space-between;
    width: 80%;
    margin-bottom: 40px;
    padding: 20px;
    background: linear-gradient(to top left, #ffffffbb, #b3daeebb);
    border: 2px solid #122442;
    border-radius: 10px;
    box-shadow: 5px 5px 10px #122442;

    &__image {
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        width: 30%;
        height: max-content;
        border: 2px solid #122442;
        border-radius: 10px;
        box-shadow: 5px 5px 10px #122442;

        & img {
            width: 100%;
        }
    }

    &__modif {
        display: flex;
        flex-direction: column;
        margin: 0 20px;

        & button {
            margin: 0 0 20px 0;
        }
    }

    &__infos {
        display: flex;
        flex-direction: column;
        width: 50%;

        & input {
            margin-bottom: 20px;
        }

        & .pi {
            &__user {
                display: flex;
                flex-direction: column;

                &__description {
                    height: 71px;
                    margin-bottom: 20px;
                    border-width: 2px;
                    border-style: inset;
                    border-color: -internal-light-dark(rgb(118, 118, 118), rgb(133, 133, 133));
                }
            }

            &__password {
                display: flex;
                flex-direction: column;
                margin-bottom: 20px;
                padding: 10px;
                border: #12244255 1px solid;
                border-radius: 10px;

                & button {
                    align-self: flex-end;
                    width: 20px;
                    height: 20px;
                    background: linear-gradient(to top left, #5dbae9, #122442);
                    color: #fff;
                }
            }

            &__save {
                display: flex;
                justify-content: flex-end;
                align-items: flex-end;
                height: 100%;

                & button {
                    margin: 0;
                }
            }
        }
    }
}
</style>