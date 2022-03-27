<template>
    <footer id="footer" class="footer">
        <p class="footer__text">@Groupomania</p>
    </footer>
</template>

<script>
export default {
    name: 'PageFooter'
}
</script>

<style lang="scss">

.footer {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
    background: linear-gradient(to top left, #5dbae9, #122442);

    &__text {
        font-size: 24px;
        color: #fff;
    }
}

@media screen and(max-width: 768px) {
    .footer {
        height: 80px;
        min-width: 380px;
        &__text {
            font-size: 18px;
        }
    }
}

</style>