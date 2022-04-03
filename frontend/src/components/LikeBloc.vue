<template>
    <div class="po__infos__likes">
        <!-- Bouton "like" -->
        <form @submit.prevent="likePublication(publication.id, 1)">
            <button type="submit" title="J'aime" class="like-btn"><i class="far fa-thumbs-up like"></i></button>
        </form>
        <p>{{ publicationLikes }}</p>

        <!-- Bouton "dislike" -->
        <form @submit.prevent="likePublication(publication.id, -1)">
            <button type="submit" title="J'aime" class="like-btn"><i class="far fa-thumbs-down dislike"></i></button>
        </form>
        <p>{{ publicationDislikes }}</p>

    </div>
</template>

<script>

import {mapState, mapActions} from 'vuex'
import axios from 'axios';

export default {
    name: 'LikeBloc',

    Data() {
        return {
            publicationLikes: "",
            publicationDislikes: "",
            publicationId: ""
        }
    },

    props: {
        publication: Object
    },

    computed: {
        ...mapState({
            publications: ["publications"]
        })
    },

    methods: {
        ...mapActions(["getPublications"]),

        likePublication(publicationId, likeValue) {
            axios.post("/publications/like", {
                publicationId: publicationId,
                userId: parseInt(this.$store.state.userId),
                likeValue: likeValue
            })
                .then(() => {
                    this.$store.dispatch("getPublications");
                    const userPublication = this.$store.state.publications.find(publication => publication.id == this.publicationId)
                    this.publicationLikes = userPublication.likes;
                    this.publicationDislikes = userPublication.dislikes;
                    console.log(this.$store.state.publications)
                    console.log(this.publicationLikes);
                    console.log(this.publicationDislikes);
                })
                .catch((error) => {
                    console.log(error);
                })
        },
    },

    created() {
        this.publicationLikes = this.publication.likes;
        console.log(this.publicationLikes);

        this.publicationDislikes = this.publication.dislikes;
        console.log(this.publicationDislikes);

        this.publicationId = this.publication.id;
        console.log(this.publicationId);
    },    

    mounted() {
        this.$store.dispatch("getOneUser");
    },

}

</script>

<style lang="scss">
    .po__infos__likes {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 80px;
        font-size: 20px;

        & .like-btn {
            background: none;
            border: none;
        }

        & i {
            font-size: 22px;
            margin: 0 5px;
            cursor: pointer;

            &:hover {
                transform: scale(1.2);
                color: #1148a8;
            }
        }
    }
</style>