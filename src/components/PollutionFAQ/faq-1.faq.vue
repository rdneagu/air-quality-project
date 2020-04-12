<template>
  <div>
    <div class="faq-text">
      Pollution, also called environmental pollution, the addition of any substance (solid, liquid, or gas) or
      any form of energy (such as heat, sound, or radioactivity) to the environment at a rate faster than it
      can be dispersed, diluted, decomposed, recycled, or stored in some harmless form. The major kinds
      of pollution, usually classified by environment, are air pollution, water pollution, and land pollution.
      Modern society is also concerned about specific types of pollutants, such as noise pollution, light
      pollution, and plastic pollution. Pollution of all kinds can have negative effects on the environment
      and wildlife and often impacts human health and well-being.
    </div>
    <div class="chart-1"></div>
  </div>
</template>

<style lang="scss">
.faq.faq-1 .content {
  display: flex;
  flex-direction: row;
  align-items: center;
  @media (min-width: 1100px) {
    flex-direction: row;
    align-items: center;
    .faq-text { margin-right: 40px; }
    .chart-1 {
      flex: 0 0 500px;
      height: 250px;
    }
  }
  @media (max-width: 1100px) {
    flex-direction: column;
    align-items: flex-start;
    .faq-text { margin-right: 0; }
    .chart-1 {
      width: 750px;
      align-self: center;
      flex: 0 0 375px;
    }
  }
  .chart-1 {
    background: url('~@/assets/images/primary-pollutants.jpg') no-repeat center center / cover;
  }
}
</style>
