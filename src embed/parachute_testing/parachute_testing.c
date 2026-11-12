#include <stdint.h>
#include <stdio.h>
#include "hardware/i2c.h"
#include "pico/stdlib.h"

#define I2C_PORT i2c1
#define I2C_SDA 14
#define I2C_SCL 15
#define MPU6050_LOW_ADDR 0x68

void i2c_setup(void) {
    i2c_init(I2C_PORT, 100 * 1000);

    gpio_set_function(I2C_SDA, GPIO_FUNC_I2C);
    gpio_set_function(I2C_SCL, GPIO_FUNC_I2C);

    gpio_pull_up(I2C_SDA);
    gpio_pull_up(I2C_SCL);
}

int i2c_read_MPU6050(uint8_t reg, uint8_t *value) {
    int result = i2c_write_blocking(
        I2C_PORT,
        MPU6050_LOW_ADDR,
        &reg,
        1,
        true
    );

    if (result != 1) return -1;

    result = i2c_read_blocking(
        I2C_PORT,
        MPU6050_LOW_ADDR,
        value,
        1,
        false
    );

    if (result != 1) return -1;
    return 0;
}


int MPU6050_wake_up() {
    uint8_t wake_up_write[] = {0x6B, 0x00};

    int result = i2c_write_blocking(
        I2C_PORT,
        MPU6050_LOW_ADDR,
        wake_up_write,
        2,
        false
    );
    if (result != 2) return -1;
    return 0;
}


int MPU6050_read_accel_y(int16_t *value) {
    uint8_t reg = 0x3D;
    uint8_t buffer[2];

    int result = i2c_write_blocking(
        I2C_PORT,
        MPU6050_LOW_ADDR,
        &reg,
        1,
        true
    );

    if (result != 1) return -1;

    result = i2c_read_blocking(
        I2C_PORT,
        MPU6050_LOW_ADDR,
        buffer,
        2,
        false
    );

    if (result != 2) return -1;

    *value = (int16_t)(buffer[0] << 8) | buffer[1];
    return 0;
}


int main()
{
    stdio_init_all();
    i2c_setup();
    sleep_ms(3000);


    // Read WHO_AM_I wich returns the device id, should be 0x68 for the MPU6050
    uint8_t device_id;
    int result;
    result = i2c_read_MPU6050(0x75, &device_id);
    if (result == -1 || device_id != 0x68){
        return -1;
    }
    printf("WHO_AM_I: %X\n\n", device_id);


    // write the PWR_MGMT_1 to 0x00 to deactivate SLEEP mode and wake up the MPU6050
    result = MPU6050_wake_up();
    if (result == -1) return -1; 

    while (true) {
        sleep_ms(1000);
        int16_t accel_y;
        result = MPU6050_read_accel_y(&accel_y);
        printf("%u\n", result);
        if (result != -1) {
            printf(">accel_y:%d\r\n", accel_y);
        }
    }
}
