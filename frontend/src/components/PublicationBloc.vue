<template>
    <section class="publication">
        <div class="publication__image">
            <img src="../assets/humour_dev.png" alt="image de démo">
        </div>

        <div class="publication__owner">
            <div class="po__infos">
                <div class="po__infos__profile">
                    <p class="po__infos__image"><img src="../assets/image_profil_default.jpg" alt="photo de profil"></p>
                    <a href="#">Pierre Fasce</a>
                </div>

                <div class="po__infos__likes">
                    <p><i class="far fa-thumbs-up"></i>0</p>  
                    <p><i class="far fa-thumbs-down"></i>0</p>
                </div>
            </div>

            <div class="po__post">
                <p class="po__post__text">Tout développeur qui se respecte connaît ce sentiment</p>
            </div>
        </div>

        <div class="publication__comments">
            <div class="publication__comments__new">
                <input type="text" name="new__comment" id="new__comment__input" placeholder="Commenter..." aria-label="Commenter la publication">
                <i class="fas fa-paper-plane"></i>
            </div>

            <div class="publication__comments__user">
                <div class="pcu__infos">
                    <p class="pcu__infos__image"><img src="../assets/image_profil_default.jpg" alt="photo de profil"></p>
                    <a href="#">Jean Bond</a>
                </div>
                <p>C'est tout à fait ça mdr!</p>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    name: 'PublicationBloc'
}
</script>

<style lang="scss">

.publication {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 80%;
    margin-bottom: 40px;
    background: linear-gradient(to top left, #ffffffbb, #b3daeebb);
    border: 2px solid #122442;
    border-radius: 10px;
    box-shadow: 5px 5px 10px #122442;

    &__image {
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        width: 100%;

        & img {
            width: 100%;
        }
    }

    &__owner {
        width: 100%;
        padding: 20px;
    }

    &__comments {
        width: 100%;
        &__new {
            display: flex;
            align-items: center;
            padding: 0 20px;
            & input {
                width: 100%;
                margin-right: 10px;
            }

            & i:hover {
                transform: scale(1.2);
                color: #1148a8;
            }
        }

        &__user {
            margin: 20px;
            padding: 10px;
            border: #12244255 1px solid;
            border-radius: 10px;
        }
    }
}

.po {
    &__infos {
        display: flex;
        justify-content: space-between;
        width: 100%;
        padding-bottom: 10px;
    
        &__profile {
            display: flex;
            align-items: center;

            & img {
                width: 100%;
            }

            & p {
                font-size: 18px;
            }
        }

        &__image {
            overflow: hidden;
            width: 30px;
            height: 30px;
            margin-right: 20px;
            border: 1px solid #122442;
            border-radius: 16px;
        }

        &__likes {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 80px;
            font-size: 20px;

            & i {
                margin-right: 5px;
                &:hover {
                    transform: scale(1.2);
                    color: #1148a8;
                }
            }
        }
    }
    
    &__post {
        padding: 5px 0 15px;
        border-bottom: #122442 3px solid;
    }
}

.pcu {
    &__infos {
        display: flex;
        align-items: center;
        width: 100%;
        padding-bottom: 10px;

        &__image {
            overflow: hidden;
            width: 30px;
            height: 30px;
            margin-right: 20px;
            border: 1px solid #122442;
            border-radius: 16px;
        }

        & img {
            width: 100%;
        }
    }
}

</style>