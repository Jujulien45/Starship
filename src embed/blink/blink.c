#include "pico/stdlib.h"
#include "stdio.h"

#ifdef CYW43_WL_GPIO_LED_PIN
#include "pico/cyw43_arch.h"
#endif

// blink delay
#ifndef LED_DELAY_MS
#define LED_DELAY_MS 1000
#endif

// initialise the pin for OUT
void pico_led_init(int8_t pin) {
    gpio_init(pin);
    gpio_set_dir(pin, GPIO_OUT);
}

bool extract_bit(uint8_t num, uint8_t bit_pos) {
    if (bit_pos > 7) return false;
    uint8_t mask = 1u << bit_pos;

    // use the mask to set the other bits to 0 then shifts to get the bit at the front
    return (num & mask) >> bit_pos;
}

int main() {
    // gpio pin number for the led
    int8_t red_led_1 = 1;
    int8_t red_led_2 = 5;
    int8_t green_led = 13;
    uint8_t counter = 0;
    pico_led_init(red_led_1);
    pico_led_init(red_led_2);
    pico_led_init(green_led);

    // blink led
    while (true) {
        counter = counter + 1;
        if (counter == 8u) counter = 0;

        gpio_put(red_led_1, extract_bit(counter, (uint8_t) 0u));
        gpio_put(red_led_2, extract_bit(counter, (uint8_t) 1u));
        gpio_put(green_led, extract_bit(counter, (uint8_t) 2u));

        //printf("%d\n", (int) counter);
        sleep_ms(LED_DELAY_MS);
    }
}
