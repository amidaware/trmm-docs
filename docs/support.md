# Support

## Community Support

Free Support: Available through Discord and Github tickets.

We help people get started with Tactical RMM using supported methods as documented here in the [public documentation](https://docs.tacticalrmm.com/).

We may give pointers, or provide additional troubleshooting steps if we believe your issue may be related to a recent update or bug.

## Commercial Support

Paid Support: See [pricing table](./sponsor.md#sponsor-with-stripe-or-paypal) for support plans.

Fully managed [hosted servers](https://support.amidaware.com) are also available.

## Public RSA Keys

Steps to provide the developers SSH access to your server for troubleshooting:

1. SSH into your server as the linux user you used to install tacticalrmm (`tactical` if you followed the install guide).


2. Add our public key:
```
mkdir -p ~/.ssh
```
```
echo 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQC63U5WPFWLKzagz4SV3DSJaYMqVd4Zq8DU518qzWzQ0vWOhDb1aN/X7AhQMBrQasV7HM9HN0Q3sRqw8ppdco9OzrhYUVV3HhJ7HHELed6g60B1Q8kaSd3Oa9n1+gfpbALjXjwAXn57AItvOynPwr4riScuV5Z/rGw7cQVmokM6yN8ZUKtWwh0W+rZVrqtdLPloqIsFrqVGxKJlriMIociu6uIYFAPDpYoInqI9dhPXLmXp/n797AOfiwlTfsyICInXsPmyyimY5eYAIfKNBrqY0QtaQgLuO3toaT4IVqSnG+flTmICb4UmC5eXy6pytf3nVef0EwRRwp4jgeLNAwG0VSjIAgeSH73b7S5P6Z3FwGSMYJxTlH0nJZgz15Oy42hfQqAFIFUl0Kknz9NiFNREK+8mAeLn4p+MdpZEd614yY5jKB1M2bQbblT6WG3flX8Kg5Yg3T/LLE5hKaK+DoD3oi2rs03n2RdzIJVl8Z09n+S8Ti9MzNdeleeBB9pVYpYYhZVLQfmN1arWyUV1PkpKDqOobW4nflqQ1Yf4Zpgg/HaQ8GAkDw1sPZ99PJt697liAbMA0lCyHmPBwgHZ6qhbfzW3dTiLHbgjscecJXUyCIn5U4F32Qp3tETzVhXYyhpBaT6KsCa665BELJSelGDyXbPVBQF4XEy0BkdqbbHVIw== support@amidaware' >> ~/.ssh/authorized_keys
```
```
chmod 600 ~/.ssh/authorized_keys
```

3. Ensure the `tactical` linux user has passwordless sudo:
```
sudo visudo
```
Add the following line to the end of the file which will be opened by running the above command, then save and exit the file.
```
tactical   ALL=(ALL:ALL) NOPASSWD:ALL
```