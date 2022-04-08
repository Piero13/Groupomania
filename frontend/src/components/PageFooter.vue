<template>
    <footer id="footer" class="footer">
        <div>
            <p class="footer__img" @click="returnTop()"><img src="../assets/icon-left-font-monochrome-white.png" alt="logo Groupomania" title="Retour au haut de la page"></p>
            <ul class="footer__links">
                <li class="footer__links__item"><a href="https://www.facebook.com/" title="Suivez-nous sur Facebook"><i class="fab fa-facebook-square"></i></a></li>
                <li class="footer__links__item"><a href="https://www.instagram.com/" title="Suivez-nous sur Instagram"><i class="fab fa-instagram"></i></a></li>
                <li class="footer__links__item"><a href="https://twitter.com/" title="Suivez-nous sur Twitter"><i class="fab fa-twitter-square"></i></a></li>
                <li class="footer__links__item"><a href="mailto:groupomania-support@gmail.com" title="Contactez-nous par mail"><i class="far fa-envelope"></i></a></li>
            </ul>
        </div>
    </footer>
</template>

<script>
export default {
    name: 'PageFooter',

    methods: {
        returnTop() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        },
    }
}
</script>

<style lang="scss">

.footer {
    display: flex;
    justify-content: center;
    padding: 20px;
    min-width: 380px;
    background: linear-gradient(to top left, #5dbae9, #122442);

    & div {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 250px;
    }

    &__img {
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 20px;
        width: 200px;
        height: 40px;
        &:hover {
            cursor: pointer;
        }

        & img {
            width: 100%;
        }
    }

    &__links {
        display: flex;
        justify-content: space-between;
        list-style: none;
        width: 100%;

        &__item {

            & a {

                & i {
                    font-size: 30px;
                    color: white;
                    transition: all 400ms;

                    &:hover {
                        transform: scale(1.2);
                        text-shadow: 3px 3px 5px #122442;
                    }
                }
            }
        }
    }
}

// @media screen and(max-width: 768px) {
//     .footer {
//         min-width: 380px;
//     }
// }

</style>