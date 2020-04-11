<template>
  <div class="pollution-vue">
    <slot name="default"></slot>
    <div class="pollution">
      <FAQ v-for="(faq, k) in faqs" :key="k" v-bind="faq" :n="k + 1" :title="`${k + 1}. ${faq.title}`" />
    </div>
  </div>
</template>

<script>
import FAQ from '@/components/FAQ.component.vue';

/* eslint-disable no-multi-str */
export default {
  components: { FAQ },
  data() {
    return {
      faqs: [
        { name: 'faq-1', title: 'WHAT IS POLLUTION?' },
        {
          name: 'faq-2',
          title: 'WHY IS IT IMPORTANT TO REDUCE POLLUTION?',
          disable: true,
          subfaq: [
            { name: 'faq-2-1', title: 'BAD FOR HEALTH' },
            { name: 'faq-2-2', title: 'BAD FOR ANIMALS' },
            { name: 'faq-2-3', title: 'RESOURCES AREN\'T FINITE' },
            {
              name: 'faq-2-4',
              title: 'CAUSES CHANGES TO THE ENVIRONMENT',
              subfaq: [
                { name: 'faq-2-4-1', title: 'ONE OF THE WORLD\'S LEADING RISK FACTORS FOR DEATH' },
                { name: 'faq-2-4-2', title: 'ONE OF THE LEADING RISK FACTORS FOR DISEASE BURDEN' },
                { name: 'faq-2-4-3', title: 'WHO IS MOST AFFECTED BY AIR POLLUTION?' },
                { name: 'faq-2-4-4', title: 'HOW ARE DEATH RATES FROM AIR POLLUTION CHANGING?' },
              ],
            },
          ],
        },
        { name: 'faq-3', title: 'PREVENTIVE MEASURES FOR POLLUTION' },
      ],
    };
  },
};
</script>

<style lang="scss">
.pollution-vue {
  flex: 1;
  position: relative;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr;
  grid-template-areas: "header header"
                       "pollution pollution";
  .pollution {
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 20px 40px 20px 0;
  }
}
</style>
