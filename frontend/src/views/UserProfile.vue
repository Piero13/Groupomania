<template>

<div>
    <PageHeader/>

    <main id="main" class="main">
    
    <div class="members">
        <aside class="search">
            <button @click="login()" class="form__btn">Retour</button>

            <div class="search__members">
                <label for="search__members__input">Rechercher des membres</label>

                <div>
                    <input type="text" name="search__members__input" id="search__members__input" class="search__members__input" aria-label="rechercher des membres" placeholder="Recherche...">
                    <i class="fas fa-search"></i>
                </div>
            </div>

            <div class="search__results">
                <div>
                    <p class="search__results__image"><img src="../assets/image_profil_default.jpg" alt="image de profil du membre"></p>

                    <a href="#">Pierre Fasce</a>
                </div>

                <div>
                    <p class="search__results__image"><img src="../assets/image_profil_default.jpg" alt="image de profil du membre"></p>

                    <a href="#">Jean Bond</a>
                </div>

                <div>
                    <p class="search__results__image"><img src="../assets/image_profil_default.jpg" alt="image de profil du membre"></p>

                    <a href="#">Anne Alfabeth</a>
                </div>

                <div>
                    <p class="search__results__image"><img src="../assets/image_profil_default.jpg" alt="image de profil du membre"></p>

                    <a href="#">John Doe</a>
                </div>
            </div>
        </aside>

        <section class="member">
            <div class="member__profile">
                <div class="member__profile__image">
                    <img src="../assets/image_profil_default.jpg" alt="image du profil">
                </div>

                <div class="member__profile__infos">
                    <div class="mpi__name">
                        <p class="mpi__firstname">Pierre</p>

                        <p class="mpi__lastname">Fasce</p>
                    </div>

                    <p class="mpi__description">La description de mon profil</p>
                </div>
            </div>

            <PublicationBloc/>
        </section>

    </div>
    </main>

    <PageFooter/>
</div>

</template>

<script>

import PageHeader from "../components/PageHeader.vue"
import PageFooter from "../components/PageFooter.vue"
import PublicationBloc from "../components/PublicationBloc.vue"

export default {
    components: {
        PageHeader,
        PageFooter,
        PublicationBloc
    },
    methods: {
        login: function() {
            this.$router.push("/home")
        }
    }
}
</script>

<style lang="scss">

.members {
    display: flex;
    justify-content: space-between;
    width: 100%;
}

.search {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 30%;
    height: fit-content;
    margin-right: 40px;
    padding: 20px;
    background: linear-gradient(to top left, #ffffffbb, #b3daeebb);
    border: 2px solid #122442;
    border-radius: 10px;
    box-shadow: 5px 5px 10px #122442;

    & .form__btn {
        margin: 0 0 20px 0;
    }

    &__members {
        display: flex;
        flex-direction: column;
        width: 100%;
        margin-bottom: 10px;

        & div {
            display: flex;
            align-items: center;
        }

        &__input {
            width: 85%;
            margin: 5px 10px 0 0;
        }
    }

    &__results {
        display: flex;
        flex-direction: column;
        width: 100%;

        & div {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            margin: 10px 0;
        }

        &__image {
            overflow: hidden;
            width: 40px;
            height: 40px;
            margin-right: 20px;
            border: 1px solid #122442;
            border-radius: 20px;

            & img {
                width: 100%;
            }
        }
    }
}

.member {
    display: flex;
    flex-direction: column;
    width: 100%;

    &__profile {
        display: flex;
        width: 100%;
        margin-bottom: 40px;
        padding: 20px;
        background: linear-gradient(to top left, #ffffffbb, #b3daeebb);
        border: 2px solid #122442;
        border-radius: 10px;
        box-shadow: 5px 5px 10px #122442;

        &__image {
            overflow: hidden;
            width: auto;
            max-width: 250px;
            height: max-content;
            margin-right: 20px;
            border: 1px solid #122442;
            border-radius: 10px;

            & img {
                width: 100%;
            }
        }

        &__infos {
            display: flex;
            flex-direction: column;
            width: 100%;

            & .mpi {
                &__name {
                    display: flex;
                    width: 100%;
                    margin-bottom: 20px;
                }

                &__lastname, &__firstname {
                    margin-right: 10px;
                    font-size: 22px;
                    font-weight: bold;
                }

                &__description {
                    font-size: 18px;
                }
            }

        }
    }

    & .publication {
        width: 100%;
    }
}

</style>