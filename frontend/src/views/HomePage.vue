<template>

<div>
    <PageHeader/>

    <main id="main" class="main">
        <h1 class="title"></h1>

        <section class="publish">
            <img v-if="publishImage" src="" alt="nouvelle image" class="publish__newImage">

            <div class="publish__form">
                <textarea type="text" placeholder="Nouvelle publication..." aria-label="texte de la publication" class="publish__input"></textarea>
                
                <a href="#"><i class="fas fa-photo-video"></i>Ajouter un média</a>
            </div>

            <button class="form__btn">Publier</button>
        </section>

        <PublicationBloc/>
    </main>

    <PageFooter/>
</div>

</template>

<script>

import PageHeader from "../components/PageHeader.vue"
import PageFooter from "../components/PageFooter.vue"
import PublicationBloc from "../components/PublicationBloc.vue"

export default {
    data() {
        return {
            publishImage: false
        }
    },
    components: {
        PageHeader,
        PageFooter,
        PublicationBloc
    }
}
</script>

<style lang="scss">

.main {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.publish {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 80%;
    padding: 20px 20px;
    margin-bottom: 40px;
    background: linear-gradient(to top left, #ffffffbb, #b3daeebb);
    border: 2px solid #122442;
    border-radius: 10px;
    box-shadow: 5px 5px 10px #122442;

    &__newImage {
        margin-bottom: 20px;
    }

    &__form {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        margin-bottom: 20px;

        & a {
            font-size: 16px;
        }

        & i {
            margin-right: 10px;
        }
    }

    &__input {
        width: 80%;
        margin-right: 20px;
    }
}

</style>

